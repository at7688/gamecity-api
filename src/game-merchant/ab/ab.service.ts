import { BadRequestException, Injectable } from '@nestjs/common';
import { MerchantCode, Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import * as numeral from 'numeral';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AbTransferType } from './enums';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'ab';
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
    // console.log(axiosConfig);
    try {
      const res = await axios.request<ResBase>(axiosConfig);
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

  signValidation(reqConfig: ReqConfig, headers) {
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

    const validAuth = this.getAuthBySignString(
      stringToSign,
      this.config.partnerKey,
    );
    if (validAuth !== headers.authorization) {
      console.log(validAuth);
      console.log(headers.authorization);
      throw new BadRequestException('驗證不合法');
    }
  }

  async getBalance(username: string, headers) {
    const reqConfig: ReqConfig = {
      method: 'GET',
      path: `/GetBalance/${username}`,
      data: '',
    };
    await this.signValidation(reqConfig, headers);

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

  async cancelTransfer(data: CancelTransferResData, headers) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      path: `/CancelTransfer`,
      data,
    };
    await this.signValidation(reqConfig, headers);

    await this.prisma.merchantLog.create({
      data: {
        merchant_code: MerchantCode.AB,
        action: 'CancelTransfer',
        data: { data, headers } as unknown as Prisma.InputJsonObject,
      },
    });

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

    const record = await this.prisma.walletRec.findFirst({
      where: {
        relative_id: data.originalTranId.toString(),
      },
    });

    if (record) {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.BET_REFOUND,
          player_id: player.id,
          amount: -record.amount,
          source: `ab/${data.originalDetails[0].betNum}`,
          relative_id: data.tranId.toString(),
        })),
      ]);
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
    await this.signValidation(reqConfig, headers);

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: MerchantCode.AB,
        action: 'Transfer',
        data: { data, headers } as unknown as Prisma.InputJsonObject,
      },
    });

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

    const detail = data.details[0];

    let type: WalletRecType;

    switch (data.type) {
      case AbTransferType.BETTING:
        type = WalletRecType.BETTING;
        await this.betting(data.tranId.toString(), detail, player.id);
        await this.prisma.$transaction([
          ...(await this.walletRecService.playerCreate({
            type,
            player_id: player.id,
            amount: data.amount,
            source: `ab/${data.type}/${detail.betNum}`,
            relative_id: data.tranId.toString(),
          })),
        ]);
        break;
      case AbTransferType.BET_RESULT:
        type = WalletRecType.BET_RESULT;
        await this.betResult(data.tranId.toString(), detail, player.id);
        await this.prisma.$transaction([
          ...(await this.walletRecService.playerCreate({
            type,
            player_id: player.id,
            amount: data.amount,
            source: `ab/${data.type}/${detail.betNum}`,
            relative_id: data.tranId.toString(),
          })),
        ]);
        break;
      case AbTransferType.PROMOTION:
        type = WalletRecType.GAME_GIFT;
        // await this.promotion(
        //   data.tranId.toString(),
        //   detail as unknown as EventDetail,
        //   player.id,
        // );
        await this.prisma.$transaction([
          ...(await this.walletRecService.playerCreate({
            type,
            player_id: player.id,
            amount: data.amount,
            source: `ab/${data.type}/${
              (detail as unknown as EventDetail).eventRecordNum
            }`,
            relative_id: data.tranId.toString(),
          })),
        ]);
        break;

      default:
        break;
    }

    return {
      resultCode: 0,
      message: null,
      balance: numeral(player.balance).add(data.amount).value(),
      version: new Date().getTime(),
    };
  }

  async promotion(trade_no: string, event: EventDetail, player_id: string) {
    //
  }

  async betResult(trade_no: string, bet: BetDetail, player_id: string) {
    await this.prisma.betRecord.update({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.platformCode,
        },
      },
      data: {
        trade_no: {
          push: trade_no,
        },
        round_id: bet.gameRoundId.toString(),
        table_code: bet.tableName,
        amount: bet.betAmount,
        deposit: bet.deposit,
        bet_target: bet.betType.toString(),
        commission_type: bet.commission,
        bet_at: new Date(bet.betTime),
        ip: bet.ip,
        player_id,
        platform_code: this.platformCode,
        game_code: bet.gameType.toString(),
      },
    });
  }

  async betting(trade_no: string, bet: BetDetail, player_id: string) {
    await this.prisma.betRecord.upsert({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.platformCode,
        },
      },

      create: {
        trade_no,
        bet_no: bet.betNum.toString(),
        round_id: bet.gameRoundId.toString(),
        table_code: bet.tableName,
        amount: bet.betAmount,
        deposit: bet.deposit,
        bet_target: bet.betType.toString(),
        commission_type: bet.commission,
        bet_at: new Date(bet.betTime),
        ip: bet.ip,
        player_id,
        platform_code: this.platformCode,
        game_code: bet.gameType.toString(),
      },
      update: {
        trade_no: {
          push: trade_no,
        },
        bet_no: bet.betNum.toString(),
        round_id: bet.gameRoundId.toString(),
        table_code: bet.tableName,
        amount: bet.betAmount,
        deposit: bet.deposit,
        bet_target: bet.betType.toString(),
        commission_type: bet.commission,
        bet_at: new Date(bet.betTime),
        ip: bet.ip,
        player_id,
        platform_code: this.platformCode,
        game_code: bet.gameType.toString(),
      },
    });
  }
}

export interface BetDetail {
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
  reason: string;
  isRetry: boolean;
  details: BetDetail[];
}

export interface CancelTransferResData {
  player: string;
  reason: string;
  tranId: number;
  isRetry: boolean;
  originalTranId: number;
  originalDetails: BetDetail[];
}

export interface EventDetail {
  amount: number;
  eventCode: string;
  eventType: number;
  settleTime: Date;
  exchangeRate: number;
  eventRecordNum: number;
}
