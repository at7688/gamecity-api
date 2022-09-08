import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { PrismaService } from 'src/prisma/prisma.service';

interface ReqConfig {
  method: string;
  path: string;
  data: any;
  md5?: string;
  date?: string;
}

interface ResBase {
  resultCode: string;
  message?: string;
  data?: any;
}

@Injectable()
export class AbService {
  constructor(private readonly prisma: PrismaService) {}
  config = {
    operatorId: '3531761',
    apiUrl: 'https://sw2.apidemo.net:8443',
    allBetKey:
      'Vc3TE5weapnq5uH6V+TmPsDfLZuL5K6omE7CZTVo8KoiXKOFwLgyp7yxaKCa4jhCC0VuaqfXnHfY8GG/TeJg9w==',
    partnerKey:
      'FZe/OUOURWKfYTtJFsoUGsXIvsk1uh8BBe9VjjmK3+9SAAGjHN3ECbMqKnV4KV0oRAVDFfU8DW0h+zYd0iT3lg==',
    contentType: 'application/json; charset=UTF-8',
    agentAcc: '1vfh4a',
    suffix: 'gxx',
  };
  balanceVersion = 0;

  getMD5Hash(data: any) {
    return CryptoJS.MD5(JSON.stringify(data)).toString(CryptoJS.enc.Base64);
  }
  getDateTime() {
    return new Date().toUTCString().replace('GMT', 'UTC');
  }

  getAuthBySignString(stringToSign: string, key: string) {
    // Get decoded key
    const decodedKey = CryptoJS.enc.Base64.parse(key);

    // Compute HMAC-SHA1 on stringToSign
    const encrypted = CryptoJS.HmacSHA1(stringToSign, decodedKey);

    // Encode (Base64) HMAC SHA1 to generate signature
    const sign = CryptoJS.enc.Base64.stringify(encrypted);

    const ah = `AB ${this.config.operatorId}:${sign}`;

    return ah;
  }

  getAuthorizationHeader(reqConfig: ReqConfig) {
    const { method, path, md5, date } = reqConfig;
    const { contentType, allBetKey } = this.config;

    const stringToSign =
      method + '\n' + md5 + '\n' + contentType + '\n' + date + '\n' + path;

    return this.getAuthBySignString(stringToSign, allBetKey);
  }

  async request(reqConfig: ReqConfig) {
    const { method, path, data } = reqConfig;
    const md5 = this.getMD5Hash(data);
    const date = this.getDateTime();

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      url: this.config.apiUrl + path,
      headers: {
        Authorization: this.getAuthorizationHeader({ ...reqConfig, md5, date }),
        'content-type': this.config.contentType,
        'content-MD5': md5,
        date,
      },
      data,
    };
    console.log(axiosConfig);
    try {
      const res = await axios.request<ResBase>(axiosConfig);
      console.log(res.data);
      if (!['OK', 'PLAYER_EXIST'].includes(res.data.resultCode)) {
        throw new BadRequestException(res.data.message);
      }
      return res.data;
    } catch (err) {
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async getAgentHandicaps() {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/GetAgentHandicaps',
      data: {
        agent: this.config.agentAcc,
      },
    };
    const res = await this.request(reqConfig);
    return res.data;
  }

  async createPlayer(player: Player) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/CheckOrCreate',
      data: {
        agent: this.config.agentAcc,
        player: player.username + this.config.suffix,
      },
    };

    await this.request(reqConfig);

    return {
      success: true,
    };
  }

  async login(player: Player) {
    // // 新檢查或新增玩家帳號至歐博
    // await this.createPlayer(player);

    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/Login',
      data: {
        player: player.username + this.config.suffix,
        language: 'zh_TW',
        returnUrl: 'https://gamecityad.kidult.one/login',
      },
    };
    const result = await this.request(reqConfig);

    return {
      path: result.data.gameLoginUrl,
    };
  }
  async logout(player: Player) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/Logout',
      data: {
        player: player.username + this.config.suffix,
      },
    };
    const res = await this.request(reqConfig);
    return {
      success: true,
    };
  }
  async getPlayer(player: Player) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/GetPlayerSetting',
      data: {
        player: player.username + this.config.suffix,
      },
    };
    const res = await this.request(reqConfig);
    return {
      ...res,
    };
  }

  async getTables() {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/GetGameTables',
      data: {
        agent: this.config.agentAcc,
      },
    };
    const res = await this.request(reqConfig);

    return {
      ...res,
    };
  }
  async getMaintenance() {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/GetMaintenanceState',
      data: {},
    };
    const res = await this.request(reqConfig);

    return res.data;
  }
  async setMaintenance(state: 1 | 0) {
    // 維護中(1), 正常(0)
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: '/SetMaintenanceState',
      data: {
        state,
      },
    };
    await this.request(reqConfig);

    return { success: true };
  }

  getValidAuth(reqConfig: ReqConfig, headers) {
    console.log(reqConfig.data);
    const md5 = reqConfig.data ? this.getMD5Hash(reqConfig.data) : '';
    const contentType = headers['content-type'] || '';
    console.log({ md5, contentType });
    const stringToSign =
      reqConfig.method +
      '\n' +
      md5 +
      '\n' +
      contentType +
      '\n' +
      headers.date +
      '\n' +
      reqConfig.path;

    return this.getAuthBySignString(stringToSign, this.config.partnerKey);
  }

  async getBalance(username: string, headers) {
    const reqConfig: ReqConfig = {
      method: 'GET',
      path: `/GetBalance/${username}`,
      data: '',
    };
    const validAuth = this.getValidAuth(reqConfig, headers);

    console.log(headers.authorization);
    console.log(validAuth);

    const player = await this.prisma.player.findUnique({
      where: {
        username: username.replace(this.config.suffix, ''),
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    return {
      resultCode: 0,
      message: null,
      balance: player.balance,
      version: new Date().getTime(),
    };
  }

  async transfer(data: TransferResData, headers) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: `/Transfer`,
      data,
    };
    const validAuth = this.getValidAuth(reqConfig, headers);

    console.log(headers.authorization);
    console.log(validAuth);

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.player.replace(this.config.suffix, ''),
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    return {
      resultCode: 0,
      message: null,
      balance: player.balance,
      version: new Date().getTime(),
    };
  }
}

export interface Detail {
  betNum: number;
  gameRoundId: number;
  status: number;
  betAmount: number;
  deposit: number;
  gameType: number;
  betType: number;
  commission: number;
  exchangeRate: number;
  betTime: Date;
  tableName: string;
  betMethod: number;
  appType: number;
  gameRoundStartTime: Date;
  ip: string;
}
export interface TransferResData {
  tranId: number;
  player: string;
  amount: number;
  currency: string;
  type: number;
  isRetry: boolean;
  details: Detail[];
}
