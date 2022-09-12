import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { format, subHours } from 'date-fns';
import * as FormData from 'form-data';
import { orderBy } from 'lodash';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GrCbReq, GrReqConfig, GrResBase } from './types';
import { GrBetRecordsRes, GrBetStatus } from './types/fetchBetRecords';

@Injectable()
export class GrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'gr';
  apiUrl = 'https://grtestbackend.richgaming.net';
  apiKey = 'b6723b61301bc1e51b9d627ee687646b';

  accSuffix = 'asg';

  async request<T extends GrResBase>(reqConfig: GrReqConfig) {
    const { method, url, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url,
      headers: {
        Authorization: this.apiKey,
        Cookie: `secret_key=${this.apiKey};`,
      },
      data,
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

  signValidation(data: GrCbReq) {
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
    const reqConfig: GrReqConfig = {
      method: 'POST',
      url: '/api/platform/reg_user_info',
      data: {
        UserName: player.username,
        Password: player.username,
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
            password: player.username,
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

    const reqConfig: GrReqConfig = {
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
    const reqConfig: GrReqConfig = {
      method: 'POST',
      url: '/api/user/logout',
      data: {
        UserName: player.username,
      },
    };
    await this.request(reqConfig);
    return {
      success: true,
    };
  }

  async fetchBetRecords(
    start: Date = subHours(new Date(), 2),
    end: Date = subHours(new Date(), 1),
  ) {
    const reqConfig: GrReqConfig = {
      method: 'POST',
      url: '/api/log/get',
      data: {
        StartAt: format(start, 'yyyy-MM-dd HH:mm:ss'),
        EndAt: format(end, 'yyyy-MM-dd HH:mm:ss'),
      },
    };
    const res = await this.request<GrBetRecordsRes>(reqConfig);

    await Promise.all(
      res.info.list.map((t) =>
        this.prisma.betRecord.update({
          where: {
            bet_no_platform_code: {
              bet_no: t.OrderID,
              platform_code: this.platformCode,
            },
          },
          data: {
            bet_detail: t as unknown as Prisma.InputJsonObject,
            win_lose_amount: t.Status !== GrBetStatus.None ? +t.Money : null,
            bet_target: t.Content,
            game_code: t.Type,
            result_at: new Date(+t.Timestamp),
            status:
              t.Status !== GrBetStatus.None
                ? BetRecordStatus.DONE
                : BetRecordStatus.BETTING,
          },
        }),
      ),
    );

    return {
      data: res.info,
    };
  }
  async fetchBetRecord(bet_no: string) {
    const reqConfig: GrReqConfig = {
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
