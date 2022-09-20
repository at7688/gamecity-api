import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { addHours, format, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { BngReqBase, BngResBase } from './types/base';
import { BngCreatePlayerReq, BngCreatePlayerRes } from './types/createPlayer';
import { BngBetRecordsReq, BngBetRecordsRes } from './types/fetchBetRecords';
import { BngGameListRes } from './types/gameList';
import * as qs from 'query-string';
import { BngTransferToReq, BngTransferToRes } from './types/transferTo';
import { WalletRecType } from 'src/wallet-rec/enums';
import { BngGetBalanceReq, BngGetBalanceRes } from './types/getBalance';
import { BngTransferBackReq, BngTransferBackRes } from './types/transferBack';
import { BetRecordStatus } from 'src/bet-record/enums';
import { v4 as uuidv4 } from 'uuid';
import { GameCategory } from 'src/game/enums';
import * as CryptoJS from 'crypto-js';
import { BngGetGameLinkReq, BngGetGameLinkRes } from './types/getGameLink';
import * as numeral from 'numeral';

@Injectable()
export class BngService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'bng';
  apiUrl = 'https://api.sandsys.pw';
  channel = '34937514';
  aesKey = '6vEG7IFphbkM59eOPdyofBQSgXYUzZlJ';
  signKey = 'SxzIAbNGWfnqmHKL7tY8dFCuX6VR1wjP';

  agentAcc = 'ASG0001UAT';

  suffix = 'asg';

  async request<T extends BngResBase>(reqConfig: BngReqBase) {
    const { method, path, data } = reqConfig;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.aesKey,
    ).toString();

    const sign = CryptoJS.MD5(encrypted + this.signKey).toString();

    const encrptedData = {
      channel: this.channel,
      data: encrypted,
      sign,
    };

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      data: encrptedData,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (res.data.result.code !== 1) {
        throw new BadRequestException(
          `${res.data.result.msg}(${res.data.result.code})`,
        );
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
    const reqConfig: BngReqBase<BngCreatePlayerReq> = {
      method: 'POST',
      path: '/v1/member/create',
      data: {
        agent: this.agentAcc,
        account: player.username,
        password: CryptoJS.MD5(player.username).toString(),
      },
    };

    await this.request<BngCreatePlayerRes>(reqConfig);

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
    const reqConfig: BngReqBase = {
      method: 'POST',
      path: '/v1/config/get_game_info_state_list',
      data: {},
    };

    const res = await this.request<BngGameListRes>(reqConfig);

    await this.prisma.game.createMany({
      data: res.game_info_state_list.map((t, i) => ({
        name: t.names.zh_cn,
        sort: i,
        code: t.id,
        platform_code: this.platformCode,
        category_code: {
          1: GameCategory.FISH,
          3: GameCategory.SLOT,
          4: GameCategory.STREET,
        }[t.type],
      })),
      skipDuplicates: true,
    });

    return res;
  }

  async getGameLink(game_id: string, player: Player) {
    const reqConfig: BngReqBase<BngGetGameLinkReq> = {
      method: 'POST',
      path: '/v1/member/login_game',
      data: {
        account: player.username,
        game_id,
        lang: 'zh_cn',
        agent: this.agentAcc,
      },
    };

    const res = await this.request<BngGetGameLinkRes>(reqConfig);

    return res.url;
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

    const reqConfig: BngReqBase<BngTransferToReq> = {
      method: 'POST',
      path: '/v1/trans/transfer',
      data: {
        serial: trans_id,
        agent: this.agentAcc,
        account: player.username,
        amount: player.balance.toString(),
        oper_type: 1,
      },
    };

    const res = await this.request<BngTransferToRes>(reqConfig);

    if (res.result.code !== 1) {
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

    return res;
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
      const reqConfig: BngReqBase<BngTransferBackReq> = {
        method: 'POST',
        path: '/v1/trans/transfer',
        data: {
          serial: trans_id,
          agent: this.agentAcc,
          account: player.username,
          amount: balance.toString(),
          oper_type: 0,
        },
      };

      await this.request<BngTransferBackRes>(reqConfig);
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

    const gameUrl = await this.getGameLink(game_id, player);

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
    const reqConfig: BngReqBase<BngGetBalanceReq> = {
      method: 'POST',
      path: '/v1/trans/check_balance',
      data: {
        account: player.username,
        agent: this.agentAcc,
      },
    };
    const res = await this.request<BngGetBalanceRes>(reqConfig);
    return +res.balance;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: BngReqBase<BngBetRecordsReq> = {
      method: 'POST',
      path: '/v1/record/get_bet_records',
      data: {
        finish_time: {
          start_time: start,
          end_time: end,
        },
        index: 0,
        limit: 5000,
      },
    };

    const res = await this.request<BngBetRecordsRes>(reqConfig);
    if (res.rows?.length) {
      await Promise.all(
        res.rows.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.member },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.game_id.toString(),
            );
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.id,
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.id,
                amount: t.bet_amount,
                valid_amount: t.valid_amount,
                win_lose_amount: numeral(t.payout_amount)
                  .subtract(t.bet_amount)
                  .value(),
                bet_at: new Date(t.bet_at),
                result_at: new Date(t.finish_at),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.game_id,
                status: {
                  1: BetRecordStatus.DONE,
                  2: BetRecordStatus.REFUND,
                  3: BetRecordStatus.REFUND,
                  4: BetRecordStatus.REFUND,
                  5: BetRecordStatus.REFUND,
                }[t.status],
                bet_detail: t as unknown as Prisma.InputJsonObject,
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
                valid_amount: t.valid_amount,
                win_lose_amount: numeral(t.payout_amount)
                  .subtract(t.bet_amount)
                  .value(),
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
