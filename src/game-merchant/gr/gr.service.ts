import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { addHours, format, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { GrReqBase, GrResBase } from './types/base';
import { GrCreatePlayerReq, GrCreatePlayerRes } from './types/createPlayer';
import { GrBetRecordsReq, GrBetRecordsRes } from './types/fetchBetRecords';
import { GrGameListReq, GrGameListRes } from './types/gameList';
import { GrGetPlayerSidReq, GrGetPlayerSidRes } from './types/getPlayerSid';
import * as qs from 'query-string';
import { GrTransferToReq, GrTransferToRes } from './types/transferTo';
import { WalletRecType } from 'src/wallet-rec/enums';
import { GrGetBalanceReq, GrGetBalanceRes } from './types/getBalance';
import { GrTransferBackReq, GrTransferBackRes } from './types/transferBack';
import { BetRecordStatus } from 'src/bet-record/enums';
import { v4 as uuidv4 } from 'uuid';
import { GameCategory } from 'src/game/enums';
import { TransferStatus } from '../transfer/enums';
import { ResCode } from 'src/errors/enums';

@Injectable()
export class GrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'gr';
  apiUrl = 'https://grtestbackend.richgaming.net';
  secretKey = 'b6723b61301bc1e51b9d627ee687646b';

  suffix = 'asg';

  async request<T extends GrResBase>(reqConfig: GrReqBase) {
    const { method, path, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: {
        Cookie: `secret_key=${this.secretKey};`,
      },
      data,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (res.data.status === 'N') {
        await this.gameMerchantService.requestErrorHandle(
          this.platformCode,
          path,
          method,
          data,
          res.data,
        );
      }
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.platformCode,
          action: 'SUCCESS',
          path,
          method,
          sendData: data,
          resData: res.data as unknown as Prisma.InputJsonObject,
        },
      });
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
    const reqConfig: GrReqBase<GrCreatePlayerReq> = {
      method: 'POST',
      path: '/api/platform/reg_user_info',
      data: {
        account: player.username,
        display_name: player.nickname,
        site_code: this.suffix,
      },
    };

    await this.request<GrCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: `${player.username}@${this.suffix}`,
      },
    });

    return this.prisma.success();
  }

  async getGameList() {
    const reqConfig: GrReqBase<GrGameListReq> = {
      method: 'POST',
      path: '/api/platform/get_agent_game_list',
      data: {
        page_index: 1,
        page_size: 100,
        language_type: 'zh_TW',
      },
    };

    const res = await this.request<GrGameListRes>(reqConfig);

    await Promise.all(
      res.data.game_list.map((t, i) => {
        return this.prisma.game.upsert({
          where: {
            code_platform_code: {
              code: t.game_type.toString(),
              platform_code: this.platformCode,
            },
          },
          create: {
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
          },
          update: {
            name: t.game_name,
            category_code: {
              1: GameCategory.HUNDRED,
              2: GameCategory.STREET,
              3: GameCategory.SLOT,
              4: GameCategory.FISH,
            }[t.game_module_type],
          },
        });
      }),
    );

    return res;
  }

  async getPlayerSid(account: string) {
    const reqConfig: GrReqBase<GrGetPlayerSidReq> = {
      method: 'POST',
      path: '/api/platform/get_sid_by_account',
      data: {
        account,
      },
    };

    const res = await this.request<GrGetPlayerSidRes>(reqConfig);

    return res.data;
  }

  async transferCheck(trans_id: string) {
    return TransferStatus.SUCCESS;
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();
    const amount = await this.gameMerchantService.beforeTransTo(
      player,
      this.platformCode,
      trans_id,
    );

    const reqConfig: GrReqBase<GrTransferToReq> = {
      method: 'POST',
      path: '/api/platform/credit_balance_v3',
      data: {
        account: `${player.username}@${this.suffix}`,
        credit_amount: amount,
        order_id: trans_id,
      },
    };

    try {
      const res = await this.request<GrTransferToRes>(reqConfig);

      try {
        await this.gameMerchantService.transToSuccess(trans_id);
      } catch (err) {
        this.prisma.error(ResCode.EXCEPTION_ERR);
      }

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

    if (balance <= 0) {
      return this.prisma.success(0);
    }

    const trans_id = uuidv4();

    const reqConfig: GrReqBase<GrTransferBackReq> = {
      method: 'POST',
      path: '/api/platform/debit_balance_v3',
      data: {
        account: `${player.username}@${this.suffix}`,
        debit_amount: balance,
        order_id: trans_id,
      },
    };

    try {
      await this.request<GrTransferBackRes>(reqConfig);

      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANS_FROM_GAME,
          player_id: player.id,
          amount: balance,
          source: this.platformCode,
          relative_id: trans_id,
        })),
      ]);

      await this.gameMerchantService.transBackSuccess(trans_id);

      return this.prisma.success(balance);
    } catch (err) {
      await this.gameMerchantService.transferBackErrorHandle(
        trans_id,
        this.platformCode,
        player,
      );
      throw err;
    }
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

    await this.transferTo(player);

    const gameUrl = `${game_url}?${query}`;

    return this.prisma.success(gameUrl);
  }

  async getBalance(player: Player) {
    const reqConfig: GrReqBase<GrGetBalanceReq> = {
      method: 'POST',
      path: '/api/platform/get_balance',
      data: {
        account: `${player.username}@${this.suffix}`,
      },
    };
    const res = await this.request<GrGetBalanceRes>(reqConfig);
    return res.data.balance;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: GrReqBase<GrBetRecordsReq> = {
      method: 'POST',
      path: '/api/platform/get_all_bet_details',
      data: {
        start_time: format(start, 'yyyy-MM-dd HH:mm:ss'),
        end_time: format(end, 'yyyy-MM-dd HH:mm:ss'),
        page_index: 1,
        page_size: 1000,
      },
    };

    const res = await this.request<GrBetRecordsRes>(reqConfig);
    if (res.data.bet_details?.length) {
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
                rolling_amount: t.valid_bet * game.nums_rolling,
                win_lose_amount: t.profit,
                bet_at: new Date(t.create_time),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.game_type.toString(),
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
                amount: t.bet,
                valid_amount: t.valid_bet,
                rolling_amount: t.valid_bet * game.nums_rolling,
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
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }
}
