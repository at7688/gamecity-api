import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import * as FormData from 'form-data';
import { orderBy } from 'lodash';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { AviaCbReq, AviaReqConfig, AviaResBase } from './types';
import { AviaBetRecordsRes, AviaBetStatus } from './types/fetchBetRecords';

@Injectable()
export class AviaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly gameMerchantService: GameMerchantService,
  ) {}
  platformCode = 'avia';
  apiUrl = 'https://api.aviaapi.vip';
  apiKey = '35641436c239435fb51a639c93d76d3c';

  pwSuffix = 'd3c';

  async request<T extends AviaResBase>(reqConfig: AviaReqConfig) {
    const { method, url, data } = reqConfig;

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url,
      headers: {
        Authorization: this.apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData,
    };
    // console.log(axiosConfig);
    try {
      const res = await axios.request<T>(axiosConfig);
      if (res.data.success === 0) {
        throw new Error(res.data.msg);
      }
      return res.data;
    } catch (err) {
      console.log('Error :' + err.message);
      throw new BadRequestException(err.message);
    }
  }

  signValidation(data: AviaCbReq) {
    const strArr = [];
    orderBy(Object.keys(data), (key) => key).forEach((key) => {
      if (key !== 'Sign') {
        strArr.push(`${key}=${data[key]}`);
      }
    });
    const keyPairs = strArr.join('&');
    const md5 = CryptoJS.MD5(keyPairs + this.apiKey).toString();
    return md5.toUpperCase() === data.Sign;
  }

  async createPlayer(player: Player) {
    const reqConfig: AviaReqConfig = {
      method: 'POST',
      url: '/api/user/register',
      data: {
        UserName: player.username,
        Password: player.username + this.pwSuffix,
      },
    };

    try {
      const result = await this.request(reqConfig);

      if (result?.success === 0) {
        throw new BadRequestException(result.msg);
      }

      if (result?.success) {
        // 新增廠商對應遊戲帳號
        return this.prisma.gameAccount.create({
          data: {
            platform_code: this.platformCode,
            player_id: player.id,
            account: player.username,
            password: player.username + this.pwSuffix,
          },
        });
      }
    } catch (err) {
      throw err;
    }
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

    const reqConfig: AviaReqConfig = {
      method: 'POST',
      url: '/api/user/login',
      data: {
        UserName: player.username,
        // CateID: '',
        // MatchID: '',
      },
    };
    const result = await this.request(reqConfig);
    return {
      url: result.info.Url,
    };
  }
  async logout(player: Player) {
    const reqConfig: AviaReqConfig = {
      method: 'POST',
      url: '/api/user/logout',
      data: {
        UserName: player.username,
      },
    };
    await this.request(reqConfig);
    return this.prisma.success();
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: AviaReqConfig = {
      method: 'POST',
      url: '/api/log/get',
      data: {
        StartAt: format(start, 'yyyy-MM-dd HH:mm:ss'),
        EndAt: format(end, 'yyyy-MM-dd HH:mm:ss'),
      },
    };
    const res = await this.request<AviaBetRecordsRes>(reqConfig);

    await Promise.all(
      res.info.list.map(async (t) => {
        const player = await this.prisma.player.findUnique({
          where: { username: t.UserName },
        });
        // 上層佔成資訊
        const [game, ratios] = await this.gameMerchantService.getBetInfo(
          player,
          this.platformCode,
          t.Type,
        );

        const record = await this.prisma.betRecord.findUnique({
          where: {
            bet_no_platform_code: {
              bet_no: t.OrderID,
              platform_code: this.platformCode,
            },
          },
        });

        if (!record) {
          await this.prisma.betRecord.create({
            data: {
              bet_no: t.OrderID,
              amount: -t.BetAmount,
              valid_amount: -t.BetMoney,
              bet_at: new Date(+t.Timestamp),
              player_id: player.id,
              category_code: game.category_code,
              platform_code: this.platformCode,
              status: BetRecordStatus.REFUND,
              bet_detail: t as unknown as Prisma.InputJsonObject,
            },
          });
          return;
        }

        return this.prisma.betRecord.update({
          where: {
            bet_no_platform_code: {
              bet_no: t.OrderID,
              platform_code: this.platformCode,
            },
          },
          data: {
            amount: +t.BetAmount,
            valid_amount: +t.BetMoney,
            bet_detail: t as unknown as Prisma.InputJsonObject,
            win_lose_amount: t.Status !== AviaBetStatus.None ? +t.Money : null,
            bet_target: t.Content,
            game_code: t.Type,
            category_code: game.category_code,
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
            result_at: new Date(+t.Timestamp),
            status:
              t.Status !== AviaBetStatus.None
                ? BetRecordStatus.DONE
                : BetRecordStatus.BETTING,
          },
        });
      }),
    );

    return {
      data: res.info,
    };
  }
  async fetchBetRecord(bet_no: string) {
    const reqConfig: AviaReqConfig = {
      method: 'POST',
      url: '/api/log/order',
      data: {
        OrderID: bet_no,
      },
    };
    const data = await this.request(reqConfig);
    return {
      data: data.info,
    };
  }
}
