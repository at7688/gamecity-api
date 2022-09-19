import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { addHours, format, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { ZgReqBase, ZgResBase } from './types/base';
import { ZgCreatePlayerReq, ZgCreatePlayerRes } from './types/createPlayer';
import { ZgBetRecordsReq, ZgBetRecordsRes } from './types/fetchBetRecords';
import { ZgGameListReq, ZgGameListRes } from './types/gameList';
import { ZgGetPlayerSidReq, ZgGetPlayerSidRes } from './types/getPlayerSid';
import * as qs from 'query-string';
import { ZgTransferToReq, ZgTransferToRes } from './types/transferTo';
import { WalletRecType } from 'src/wallet-rec/enums';
import { ZgGetBalanceReq, ZgGetBalanceRes } from './types/getBalance';
import { ZgTransferBackReq, ZgTransferBackRes } from './types/transferBack';
import { BetRecordStatus } from 'src/bet-record/enums';
import { v4 as uuidv4 } from 'uuid';
import { GameCategory } from 'src/game/enums';

@Injectable()
export class ZgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'zg';
  apiUrl = 'https://api.sandsys.pw';
  channel = '34937514';
  aesKey = '6vEG7IFphbkM59eOPdyofBQSgXYUzZlJ';
  md5Key = 'SxzIAbNGWfnqmHKL7tY8dFCuX6VR1wjP';

  suffix = 'asg';

  async request<T extends ZgResBase>(reqConfig: ZgReqBase) {
    const { method, path, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: {
        // Cookie: `secret_key=${this.secretKey};`,
      },
      data,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      console.log(res.data);
      if (res.data.status === 'N') {
        throw new BadRequestException(`${res.data.message}(${res.data.code})`);
      }
      return res.data;
    } catch (err) {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.platformCode,
          action: 'ERROR',
          path,
          method,
          sendData: data,
          resData: err.response.data,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: ZgReqBase<ZgCreatePlayerReq> = {
      method: 'POST',
      path: '/api/platform/reg_user_info',
      data: {
        account: player.username,
        display_name: player.nickname,
        site_code: this.suffix,
      },
    };

    await this.request<ZgCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: `${player.username}@${this.suffix}`,
      },
    });

    return {
      success: true,
    };
  }

  async getGameList() {
    const reqConfig: ZgReqBase<ZgGameListReq> = {
      method: 'POST',
      path: '/api/platform/get_agent_game_list',
      data: {
        page_index: 1,
        page_size: 100,
        language_type: 'zh_TW',
      },
    };

    const res = await this.request<ZgGameListRes>(reqConfig);

    await this.prisma.game.createMany({
      data: res.data.game_list.map((t, i) => ({
        name: t.game_name,
        sort: i,
        code: t.game_type.toString(),
        platform_code: this.platformCode,
        category_code: {
          1: GameCategory.HUNDRED,
          2: GameCategory.STREET,
          3: GameCategory.SLOT,
          4: GameCategory.FISH,
        }[t.game_module_type],
      })),
      skipDuplicates: true,
    });

    return res;
  }

  async getPlayerSid(account: string) {
    const reqConfig: ZgReqBase<ZgGetPlayerSidReq> = {
      method: 'POST',
      path: '/api/platform/get_sid_by_account',
      data: {
        account,
      },
    };

    const res = await this.request<ZgGetPlayerSidRes>(reqConfig);

    return res.data;
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

    const reqConfig: ZgReqBase<ZgTransferToReq> = {
      method: 'POST',
      path: '/api/platform/credit_balance_v3',
      data: {
        account: `${player.username}@${this.suffix}`,
        credit_amount: player.balance,
        order_id: trans_id,
      },
    };

    const res = await this.request<ZgTransferToRes>(reqConfig);

    if (res.status === 'N') {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANSFER_FROM_GAME,
          player_id: player.id,
          amount: player.balance,
          source: this.platformCode,
          relative_id: trans_id,
          note: '轉入遊戲失敗',
        })),
      ]);
    }

    // 紀錄轉入
    await this.gameMerchantService.transferRecord(
      player,
      this.platformCode,
      true,
    );

    return res.data;
  }

  async transferBack(player: Player) {
    const { balance, account } = await this.getBalance(player);

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
      const reqConfig: ZgReqBase<ZgTransferBackReq> = {
        method: 'POST',
        path: '/api/platform/debit_balance_v3',
        data: {
          account,
          debit_amount: balance,
          order_id: trans_id,
        },
      };

      await this.request<ZgTransferBackRes>(reqConfig);
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

    const account = `${player.username}@${this.suffix}`;
    const { game_url, sid } = await this.getPlayerSid(account);

    const query = qs.stringify({ sid, game_type: game_id });

    const currentPlayer = await this.prisma.player.findUnique({
      where: { id: player.id },
    });

    if (currentPlayer.balance) {
      await this.transferTo(currentPlayer);
    }

    return {
      path: `${game_url}?${query}`,
    };
  }

  async getBalance(player: Player) {
    const reqConfig: ZgReqBase<ZgGetBalanceReq> = {
      method: 'POST',
      path: '/api/platform/get_balance',
      data: {
        account: `${player.username}@${this.suffix}`,
      },
    };
    const res = await this.request<ZgGetBalanceRes>(reqConfig);
    return res.data;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: ZgReqBase<ZgBetRecordsReq> = {
      method: 'POST',
      path: '/api/platform/get_all_bet_details',
      data: {
        start_time: format(start, 'yyyy-MM-dd HH:mm:ss'),
        end_time: format(end, 'yyyy-MM-dd HH:mm:ss'),
        page_index: 1,
        page_size: 1000,
      },
    };

    const res = await this.request<ZgBetRecordsRes>(reqConfig);
    if (res.data.bet_details.length) {
      await Promise.all(
        res.data.bet_details.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.account.replace(`@${this.suffix}`, '') },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.game_type.toString(),
            );
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.id_str.toString(),
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.id_str.toString(),
                amount: t.bet,
                valid_amount: t.valid_bet,
                win_lose_amount: t.profit,
                bet_at: new Date(t.create_time),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.game_type.toString(),
                status: BetRecordStatus.DONE,
                bet_detail: t as unknown as Prisma.InputJsonObject,
                ratios: {
                  createMany: {
                    data: ratios.map((r) => ({
                      agent_id: r.agent_id,
                      ratio: r.ratio,
                    })),
                    skipDuplicates: true,
                  },
                },
              },
              update: {
                valid_amount: t.valid_bet,
                win_lose_amount: t.profit,
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
  async fetchBetRecord(bet_no: string) {
    const reqConfig: ZgReqBase = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }
}
