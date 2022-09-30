import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { getUnixTime } from 'date-fns';
import * as numeral from 'numeral';
import * as qs from 'query-string';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { BwinReqBase, BwinResBase } from './types/base';
import { BwinCreatePlayerReq, BwinCreatePlayerRes } from './types/createPlayer';
import { BwinBetRecordsReq, BwinBetRecordsRes } from './types/fetchBetRecords';
import { BwinGameListReq, BwinGameListRes } from './types/gameList';
import { BwinGetBalanceReq, BwinGetBalanceRes } from './types/getBalance';
import { BwinGetGameLinkReq, BwinGetGameLinkRes } from './types/getGameLink';
import { BwinTransferBackReq, BwinTransferBackRes } from './types/transferBack';
import { BwinTransferToReq, BwinTransferToRes } from './types/transferTo';
import { v4 as uuidv4 } from 'uuid';
import { GameCategory } from 'src/game/enums';
import { ResCode } from 'src/errors/enums';
import { TransferStatus } from '../transfer/enums';
import { BwinTransferCheckRes } from './types/transferCheck';
@Injectable()
export class BwinService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'bwin';
  apiUrl = 'https://api-stage.at888888.com/service';
  apiKey = '0f12914a-4714-4ed8-8248-2b2cfb473578';
  apiToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU2NywidXNlcklkIjoxNDk5LCJwYXNzd29yZCI6IiQyYiQwNSRtTUNlWEdRWi5US1R6UVFLcEFLY0ouVHNleVhYc2ltN05qdkFYNnVLc3hJT3ZmVlIzZUtFbSIsInVzZXJuYW1lIjoia2lkdWx0Iiwic3ViIjowLCJjdXJyZW5jeSI6IlRXRCIsInBhcmVudElkIjoxLCJpYXQiOjE2NjI5ODU1MzksImV4cCI6OTAwNzIwMDkxNzcyNjUzMH0.ky-Eh9E7giLMFGArXFK11Yis2-qqa8Y0rOMvIoBXelg';
  creditMultiple = 100;

  async request<T extends BwinResBase>(reqConfig: BwinReqBase) {
    const { method, path, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: {
        Authorization: 'Bearer ' + this.apiToken,
      },
      data,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (res.data.error) {
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
      this.prisma.error(ResCode.EXCEPTION_ERR);
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: BwinReqBase<BwinCreatePlayerReq> = {
      method: 'POST',
      path: '/api/v1/players',
      data: {
        username: player.username,
        nickname: player.nickname,
      },
    };

    await this.request<BwinCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: player.username,
      },
    });

    return this.prisma.success();
  }

  async getGameList() {
    const query = qs.stringify({
      type: 'all',
      lang: 'zh',
    });
    const reqConfig: BwinReqBase<BwinGameListReq> = {
      method: 'GET',
      path: `/api/v1/games?${query}`,
    };

    const res = await this.request<BwinGameListRes>(reqConfig);
    if (res.data.length) {
      await Promise.all(
        res.data.map((t, i) => {
          return this.prisma.game.upsert({
            where: {
              code_platform_code: {
                code: t.productId,
                platform_code: this.platformCode,
              },
            },
            create: {
              name: t.name,
              sort: i,
              code: t.productId,
              platform_code: this.platformCode,
              category_code: {
                fish: GameCategory.FISH,
                slot: GameCategory.SLOT,
                coc: GameCategory.STREET,
              }[t.type],
            },
            update: {
              name: t.name,
              category_code: {
                fish: GameCategory.FISH,
                slot: GameCategory.SLOT,
                coc: GameCategory.STREET,
              }[t.type],
            },
          });
        }),
      );
    }

    return res;
  }

  async getGameLink(player: Player, productId: string) {
    const query = qs.stringify({
      productId,
      player: player.username,
    });

    const reqConfig: BwinReqBase<BwinGetGameLinkReq> = {
      method: 'GET',
      path: `/api/v1/games/gamelink?${query}`,
    };

    const res = await this.request<BwinGetGameLinkRes>(reqConfig);

    return res.data.url;
  }

  async transferCheck(trans_id: string) {
    const reqConfig: BwinReqBase = {
      method: 'GET',
      path: `/api/v1/profile/transactions?id=${trans_id}`,
    };
    const res = await this.request<BwinTransferCheckRes>(reqConfig);

    if (res.data.length) {
      return TransferStatus.SUCCESS;
    }

    return TransferStatus.FAILED;
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();
    const amount = await this.gameMerchantService.beforeTransTo(
      player,
      this.platformCode,
      trans_id,
    );
    if (amount === 0) return;

    const reqConfig: BwinReqBase<BwinTransferToReq> = {
      method: 'POST',
      path: '/api/v1/players/deposit',
      data: {
        transactionId: trans_id,
        amount: numeral(amount).multiply(this.creditMultiple).value(),
        player: player.username,
      },
    };

    try {
      const res = await this.request<BwinTransferToRes>(reqConfig);

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

    const reqConfig: BwinReqBase<BwinTransferBackReq> = {
      method: 'POST',
      path: '/api/v1/players/withdraw',
      data: {
        transactionId: trans_id,
        amount: numeral(balance).multiply(this.creditMultiple).value(),
        player: player.username,
      },
    };

    try {
      await this.request<BwinTransferBackRes>(reqConfig);

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
    if (!game_id) {
      this.prisma.error(ResCode.EMPTY_GAME_CODE, '遊戲不可為空');
    }
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

    await this.transferTo(player);

    return this.prisma.success(gameUrl);
  }

  async getBalance(player: Player) {
    const reqConfig: BwinReqBase<BwinGetBalanceReq> = {
      method: 'GET',
      path: `/api/v1/players?player=${player.username}`,
    };
    const res = await this.request<BwinGetBalanceRes>(reqConfig);
    return numeral(res.data[0].balance).divide(this.creditMultiple).value();
  }

  async fetchBetRecords(start: Date, end: Date) {
    const query = qs.stringify({
      start: getUnixTime(start) * 1000,
      end: getUnixTime(end) * 1000,
      pageSize: 10000,
    });
    const reqConfig: BwinReqBase<BwinBetRecordsReq> = {
      method: 'GET',
      path: `/api/v1/profile/rounds?${query}`,
    };

    const res = await this.request<BwinBetRecordsRes>(reqConfig);

    if (res.data.length) {
      await Promise.all(
        res.data.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.player },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.productId.toString(),
            );
            const betAmount = numeral(t.bet)
              .divide(this.creditMultiple)
              .value();
            const validAmount = numeral(t.validBet)
              .divide(this.creditMultiple)
              .value();
            const winLoseAmount = numeral(t.result)
              .divide(this.creditMultiple)
              .value();
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.id.toString(),
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.id.toString(),
                amount: betAmount,
                valid_amount: validAmount,
                rolling_amount: validAmount * game.nums_rolling,
                win_lose_amount: winLoseAmount,
                bet_at: new Date(t.createdAt),
                result_at: new Date(t.endAt),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.productId,
                status: {
                  playing: BetRecordStatus.BETTING,
                  finish: BetRecordStatus.DONE,
                  cancel: BetRecordStatus.REFUND,
                }[t.status],
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
                bet_detail: t as unknown as Prisma.InputJsonObject,
                status: {
                  playing: BetRecordStatus.BETTING,
                  finish: BetRecordStatus.DONE,
                  cancel: BetRecordStatus.REFUND,
                }[t.status],
                amount: betAmount,
                valid_amount: validAmount,
                rolling_amount: validAmount * game.nums_rolling,
                win_lose_amount: winLoseAmount,
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
    const reqConfig: BwinReqBase = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }
}
