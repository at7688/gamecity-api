import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { addHours, format, subHours, subMinutes } from 'date-fns';
import * as numeral from 'numeral';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import {
  AbBetDetail,
  AbBetResultDetail,
  AbCancelTransferResData,
  AbEventDetail,
  AbReqConfig,
  AbResBase,
  AbTransferResData,
  AbTransferType,
} from './types';
import { AbBetRecordsRes, AbBetStatus } from './types/fetchBetRecords';

@Injectable()
export class AbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'ab';
  operatorId = '3531761';
  apiUrl = 'https://sw2.apidemo.net:8443';
  allBetKey =
    'Vc3TE5weapnq5uH6V+TmPsDfLZuL5K6omE7CZTVo8KoiXKOFwLgyp7yxaKCa4jhCC0VuaqfXnHfY8GG/TeJg9w==';
  partnerKey =
    'FZe/OUOURWKfYTtJFsoUGsXIvsk1uh8BBe9VjjmK3+9SAAGjHN3ECbMqKnV4KV0oRAVDFfU8DW0h+zYd0iT3lg==';
  contentType = 'application/json; charset=UTF-8';
  agentAcc = '1vfh4a';
  suffix = 'gxx';
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

    const ah = `AB ${this.operatorId}:${sign}`;

    return ah;
  }

  getAuthorizationHeader(reqConfig: AbReqConfig) {
    const { method, path, md5, date } = reqConfig;

    const stringToSign =
      method + '\n' + md5 + '\n' + this.contentType + '\n' + date + '\n' + path;

    return this.getAuthBySignString(stringToSign, this.allBetKey);
  }

  async request<T extends AbResBase>(reqConfig: AbReqConfig) {
    const { method, path, data } = reqConfig;
    const md5 = this.getMD5Hash(data);
    const date = this.getDateTime();

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      url: this.apiUrl + path,
      headers: {
        Authorization: this.getAuthorizationHeader({ ...reqConfig, md5, date }),
        'content-type': this.contentType,
        'content-MD5': md5,
        date,
      },
      data,
    };
    // console.log(axiosConfig);
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

  async getAgentHandicaps() {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/GetAgentHandicaps',
      data: {
        agent: this.agentAcc,
      },
    };
    const res = await this.request(reqConfig);
    return res.data;
  }

  async createPlayer(player: Player) {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/CheckOrCreate',
      data: {
        agent: this.agentAcc,
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
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/Login',
      data: {
        player: player.username + this.suffix,
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
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/Logout',
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
    const reqConfig: AbReqConfig = {
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
  async getTables() {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/GetGameTables',
      data: {
        agent: this.agentAcc,
      },
    };
    const res = await this.request(reqConfig);

    return {
      ...res,
    };
  }
  async getMaintenance() {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/GetMaintenanceState',
      data: {},
    };
    const res = await this.request(reqConfig);

    return res.data;
  }
  async setMaintenance(state: 1 | 0) {
    // 維護中(1), 正常(0)
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/SetMaintenanceState',
      data: {
        state,
      },
    };
    await this.request(reqConfig);

    return { success: true };
  }

  async fetchBetRecords(start: Date = subMinutes(new Date(), 30)) {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/PagingQueryBetRecords',
      data: {
        agent: this.agentAcc,
        startDateTime: format(start, 'yyyy-MM-dd HH:mm:ss'),
        endDateTime: format(addHours(start, 1), 'yyyy-MM-dd HH:mm:ss'),
        pageSize: 1000,
        pageNum: 1,
      },
    };

    const res = await this.request<AbBetRecordsRes>(reqConfig);

    if (res.resultCode === 'OK') {
      await Promise.all(
        res.data.list.map(async (t) => {
          try {
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
                // bet_target: t.betType.toString(),
                // game_code: t.gameType.toString(),
                status: {
                  [AbBetStatus.BETTING]: BetRecordStatus.BETTING,
                  [AbBetStatus.DONE]: BetRecordStatus.DONE,
                  [AbBetStatus.REFUND]: BetRecordStatus.REFUND,
                  [AbBetStatus.FAILED]: BetRecordStatus.REFUND,
                  [AbBetStatus.WATING_RESULT]: BetRecordStatus.BETTING,
                }[t.status],
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
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }

  signValidation(reqConfig: AbReqConfig, headers) {
    const md5 = headers['content-md5'] || '';
    const contentType = headers['content-type'] || '';
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

    const validAuth = this.getAuthBySignString(stringToSign, this.partnerKey);
    if (validAuth !== headers.authorization) {
      console.log(validAuth);
      console.log(headers.authorization);
      throw new BadRequestException('驗證不合法');
    }
  }
}
