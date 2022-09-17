import { GrReqBase } from './types/base';
import { GrResBase } from './../../../dist/game-merchant/gr/types.d';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { addHours, format, subMinutes } from 'date-fns';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { GrBetRecordsRes, GrBetStatus } from './types/fetchBetRecords';

@Injectable()
export class GrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'gr';
  categoryCode = 'CHESS';
  apiUrl = 'https://grtestbackend.richgaming.net';
  secretKey = 'b6723b61301bc1e51b9d627ee687646b';

  suffix = 'asg';

  async request<T extends GrResBase>(reqConfig: GrReqBase) {
    const { method, path, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      url: this.apiUrl + path,
      headers: {
        Cookie: `secret_key=${this.secretKey};`,
      },
      data,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (!['OK', 'PLAYER_EXIST'].includes(res.data.resultCode)) {
        throw new BadRequestException(res.data.message);
      }
      return res.data;
    } catch (err) {
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/CheckOrCreate',
      data: {
        player: player.username + this.suffix,
      },
    };

    await this.request(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: player.username + this.suffix,
      },
    });

    return {
      success: true,
    };
  }

  async login(player: Player) {
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
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/login',
      data: {
        player: player.username + this.suffix,
        language: 'zh_TW',
        returnUrl: 'https://gamecityad.kidult.one/login',
      },
    };
    const result = await this.request(reqConfig);

    return {
      path: result.data.gameloginUrl,
    };
  }
  async logout(player: Player) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/logout',
      data: {
        player: player.username + this.suffix,
      },
    };
    const res = await this.request(reqConfig);
    return {
      success: true,
    };
  }
  async getPlayer(player: Player) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/GetPlayerSetting',
      data: {
        player: player.username + this.suffix,
      },
    };
    const res = await this.request(reqConfig);
    return {
      ...res,
    };
  }

  async fetchBetRecords(start: Date = subMinutes(new Date(), 30)) {
    const reqConfig: GrReqBase = {
      method: 'POST',
      path: '/PagingQueryBetRecords',
      data: {
        startDateTime: format(start, 'yyyy-MM-dd HH:mm:ss'),
        endDateTime: format(addHours(start, 1), 'yyyy-MM-dd HH:mm:ss'),
        pageSize: 1000,
        pageNum: 1,
      },
    };

    const res = await this.request<GrBetRecordsRes>(reqConfig);

    if (res.resultCode === 'OK') {
      await Promise.all(
        res.data.list.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.player.replace(this.suffix, '') },
            });
            const record = await this.prisma.betRecord.findUnique({
              where: {
                bet_no_platform_code: {
                  bet_no: t.betNum.toString(),
                  platform_code: this.platformCode,
                },
              },
            });
            if (!record) {
              await this.prisma.betRecord.create({
                data: {
                  bet_no: t.betNum.toString(),
                  amount: t.betAmount,
                  bet_target: t.betType.toString(),
                  bet_at: new Date(t.betTime),
                  player_id: player.id,
                  platform_code: this.platformCode,
                  category_code: this.categoryCode,
                  game_code: t.gameType.toString(),
                  status: BetRecordStatus.REFUND,
                  bet_detail: t as unknown as Prisma.InputJsonObject,
                },
              });
              return;
            }
            // 上層佔成資訊
            const [category_code, ratios] =
              await this.gameMerchantService.getBetInfo(
                player,
                this.platformCode,
                t.gameType.toString(),
              );
            await this.prisma.betRecord.update({
              where: {
                bet_no_platform_code: {
                  bet_no: t.betNum.toString(),
                  platform_code: this.platformCode,
                },
              },
              data: {
                bet_detail: t as unknown as Prisma.InputJsonObject,
                win_lose_amount: t.winOrLossAmount,
                result_at: new Date(t.gameRoundEndTime),
                category_code,

                // bet_target: t.betType.toString(),
                // game_code: t.gameType.toString(),
                status: {
                  [GrBetStatus.BETTING]: BetRecordStatus.BETTING,
                  [GrBetStatus.DONE]: BetRecordStatus.DONE,
                  [GrBetStatus.REFUND]: BetRecordStatus.REFUND,
                  [GrBetStatus.FAILED]: BetRecordStatus.REFUND,
                  [GrBetStatus.WATING_RESULT]: BetRecordStatus.BETTING,
                }[t.status],
                ratios: {
                  createMany: {
                    data: ratios.map((t) => ({
                      agent_id: t.agent_id,
                      ratio: t.ratio,
                    })),
                    skipDuplicates: true,
                  },
                },
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
