import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import { BetRecordStatus } from 'src/bet-record/enums';
import { ResCode } from 'src/errors/enums';
import { GameCategory } from 'src/game/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { v4 as uuidv4 } from 'uuid';
import { GameMerchantService } from '../game-merchant.service';
import { WmReqBase, WmResBase } from './types/base';
import { WmCreatePlayerReq, WmCreatePlayerRes } from './types/createPlayer';
import { WmBetRecordsReq, WmBetRecordsRes } from './types/fetchBetRecords';
import { WmGetBalanceReq, WmGetBalanceRes } from './types/getBalance';
import { WmGetGameLinkReq, WmGetGameLinkRes } from './types/getGameLink';
import { WmTransferBackReq, WmTransferBackRes } from './types/transferBack';
import { WmTransferToReq, WmTransferToRes } from './types/transferTo';

@Injectable()
export class WmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'wm';
  apiUrl = 'https://api.a45.me/api/public/Gateway.php';
  vendorId = 'asgtwapi';
  signature = '4457b39b166cf29dc6ee390e1e3783be';

  async request<T extends WmResBase>(reqConfig: WmReqBase) {
    const { method, path, data } = reqConfig;

    // const query = qs.stringify(data)

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      params: {
        vendorId: this.vendorId,
        signature: this.signature,
        ...data,
      },
    };
    console.log(axiosConfig);
    const res = await axios.request<T>(axiosConfig);
    console.log(res.data);
    if (![0, 107].includes(res.data.errorCode)) {
      await this.gameMerchantService.requestErrorHandle(
        this.platformCode,
        path,
        method,
        data,
        res.data,
      );
      this.prisma.error(ResCode.GAME_MERCHANT_ERR, JSON.stringify(res.data));
    }
    return res.data;
  }

  async createPlayer(player: Player) {
    const username = player.username;
    const password = CryptoJS.MD5(player.username).toString();
    const reqConfig: WmReqBase<WmCreatePlayerReq> = {
      method: 'POST',
      path: '',
      data: {
        cmd: 'MemberRegister',
        user: username,
        username,
        password,
        syslang: 0,
      },
    };

    const res = await this.request<WmCreatePlayerRes>(reqConfig);

    if (!res) {
      throw new BadGatewayException('新增帳號失敗');
    }

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: username,
        password,
      },
    });

    return this.prisma.success();
  }

  async getGameList() {
    const gameMap = {
      101: '百家樂',
      102: '龍虎',
      103: '輪盤',
      104: '骰寶',
      105: '牛牛',
      107: '番攤',
      108: '色碟',
      110: '魚蝦蟹',
      128: '安達巴哈',
    };

    await this.prisma.game.createMany({
      data: Object.entries(gameMap).map(([code, name], i) => ({
        name,
        sort: i,
        code,
        platform_code: this.platformCode,
        category_code: GameCategory.LIVE,
      })),
      skipDuplicates: true,
    });

    return this.prisma.success();
  }

  async getGameLink(player: Player, game_id: string) {
    const lobbyMap: Record<string, string> = {
      101: 'onlybac',
      102: 'onlydgtg',
      103: 'onlyrou',
      104: 'onlysicbo',
      105: 'onlyniuniu',
      107: 'onlyfantan',
      108: 'onlysedie',
      110: 'onlyfishshrimpcrab',
      128: 'onlyandarbahar',
    };
    const reqConfig: WmReqBase<WmGetGameLinkReq> = {
      method: 'POST',
      path: '',
      data: {
        cmd: 'SigninGame',
        user: player.username,
        password: CryptoJS.MD5(player.username).toString(),
        lang: 9,
        syslang: 0,
        voice: 'cn',
        mode: lobbyMap[game_id],
      },
    };

    const res = await this.request<WmGetGameLinkRes>(reqConfig);

    if (!res) {
      throw new BadRequestException('獲取遊戲連結失敗');
    }

    return res.result;
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_TO_GAME,
        player_id: player.id,
        amount: -player.balance,
        source: this.platformCode,
        relative_id: trans_id,
      })),
    ]);

    const reqConfig: WmReqBase<WmTransferToReq> = {
      method: 'POST',
      path: '',
      data: {
        cmd: 'ChangeBalance',
        user: player.username,
        money: player.balance,
        order: trans_id,
      },
    };

    try {
      const res = await this.request<WmTransferToRes>(reqConfig);
      // 紀錄轉入
      await this.gameMerchantService.transferRecord(
        player,
        this.platformCode,
        true,
      );

      return res;
    } catch (err) {
      await this.gameMerchantService.transferToErrorHandle(
        trans_id,
        this.platformCode,
        player,
      );
      throw err;
    }
  }

  async transferBack(player: Player) {
    const balance = await this.getBalance(player);

    const trans_id = uuidv4();

    if (balance > 0) {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANSFER_FROM_GAME,
          player_id: player.id,
          amount: balance,
          source: this.platformCode,
          relative_id: trans_id,
        })),
      ]);
      const reqConfig: WmReqBase<WmTransferBackReq> = {
        method: 'POST',
        path: '',
        data: {
          cmd: 'ChangeBalance',
          user: player.username,
          money: balance,
          order: trans_id,
        },
      };

      try {
        await this.request<WmTransferBackRes>(reqConfig);
      } catch (err) {
        await this.gameMerchantService.transferToErrorHandle(
          trans_id,
          this.platformCode,
          player,
        );
        throw err;
      }
    }

    // 紀錄轉回
    await this.gameMerchantService.transferRecord(
      player,
      this.platformCode,
      false,
    );

    return {
      balance, // 轉回的餘額
    };
  }

  async login(game_id: string, player: Player) {
    const gameAcc = await this.prisma.gameAccount.findUnique({
      where: {
        platform_code_player_id: {
          platform_code: this.platformCode,
          player_id: player.id,
        },
      },
    });

    if (!gameAcc) {
      await this.createPlayer(player);
    }

    const gameUrl = await this.getGameLink(player, game_id);

    const currentPlayer = await this.prisma.player.findUnique({
      where: { id: player.id },
    });

    if (currentPlayer.balance) {
      await this.transferTo(currentPlayer);
    }

    return {
      path: gameUrl,
    };
  }

  async getBalance(player: Player) {
    const reqConfig: WmReqBase<WmGetBalanceReq> = {
      method: 'POST',
      path: '',
      data: {
        cmd: 'GetBalance',
        user: player.username,
      },
    };
    const res = await this.request<WmGetBalanceRes>(reqConfig);
    return res.result;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: WmReqBase<WmBetRecordsReq> = {
      method: 'POST',
      path: '',
      data: {
        cmd: 'GetDateTimeReport',
        startTime: format(start, 'yyyyMMddHHmmss'),
        endTime: format(end, 'yyyyMMddHHmmss'),
      },
    };

    const res = await this.request<WmBetRecordsRes>(reqConfig);
    if (res.result?.length) {
      await Promise.all(
        res.result.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.user },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.gid.toString(),
            );
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.betId,
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.betId,
                amount: +t.bet,
                valid_amount: +t.validbet,
                rolling_amount: +t.validbet * game.nums_rolling,
                win_lose_amount: +t.winLoss,
                bet_at: new Date(t.betTime),
                result_at: new Date(t.settime),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.gid,
                status: BetRecordStatus.DONE,
                bet_detail: t as unknown as Prisma.InputJsonObject,
                nums_rolling: game.nums_rolling,
                ratios: {
                  createMany: {
                    data: ratios.map((r) => ({
                      agent_id: r.agent_id,
                      ratio: r.ratio,
                      water: r.water,
                      water_duty: r.water_duty,
                    })),
                    skipDuplicates: true,
                  },
                },
              },
              update: {
                amount: +t.bet,
                valid_amount: +t.validbet,
                rolling_amount: +t.validbet * game.nums_rolling,
                win_lose_amount: +t.winLoss,
                bet_detail: t as unknown as Prisma.InputJsonObject,
              },
            });
          } catch (err) {
            console.log(t, err);
          }
        }),
      );
    }

    return res;
  }
}
