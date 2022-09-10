import { BadRequestException, Injectable } from '@nestjs/common';
import { MerchantCode, Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as FormData from 'form-data';
import { orderBy } from 'lodash';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import * as CryptoJS from 'crypto-js';
import {
  AviaBalanceCbReq,
  AviaCbReq,
  AviaCbRes,
  AviaTransferCbReq,
  AviaTransferType,
} from './types';

interface ReqConfig {
  method: string;
  url: string;
  data: any;
}

interface ResBase {
  success: 1 | 0;
  msg?: string;
  info?: any;
}

@Injectable()
export class AviaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'avia';
  apiUrl = 'https://api.aviaapi.vip';
  apiKey = '35641436c239435fb51a639c93d76d3c';

  pwSuffix = 'd3c';

  async request(reqConfig: ReqConfig) {
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
      const res = await axios.request<ResBase>(axiosConfig);
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
    const reqConfig: ReqConfig = {
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

    const reqConfig: ReqConfig = {
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
    const reqConfig: ReqConfig = {
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
}
