import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';

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
  config = {
    operatorId: '3531761',
    apiUrl: 'https://sw2.apidemo.net:8443',
    key: 'Vc3TE5weapnq5uH6V+TmPsDfLZuL5K6omE7CZTVo8KoiXKOFwLgyp7yxaKCa4jhCC0VuaqfXnHfY8GG/TeJg9w==',
    contentType: 'application/json; charset=UTF-8',
    agentAcc: '1vfh4a',
    suffix: 'gxx',
  };

  getMD5Hash(data: any) {
    return CryptoJS.MD5(JSON.stringify(data)).toString(CryptoJS.enc.Base64);
  }
  getDateTime() {
    return new Date().toUTCString().replace('GMT', 'UTC');
  }

  getAuthorizationHeader(reqConfig: ReqConfig) {
    const { method, path, md5, date } = reqConfig;
    const { contentType, key, operatorId } = this.config;
    //httpMethod, contentMD5, contentType, requestTime, path, key, operatorId
    // Construct string to sign
    const stringToSign =
      method + '\n' + md5 + '\n' + contentType + '\n' + date + '\n' + path;

    // Get decoded key
    const decodedKey = CryptoJS.enc.Base64.parse(key);

    // Compute HMAC-SHA1 on stringToSign
    const encrypted = CryptoJS.HmacSHA1(stringToSign, decodedKey);

    // Encode (Base64) HMAC SHA1 to generate signature
    const sign = CryptoJS.enc.Base64.stringify(encrypted);

    // Construct authorization header
    const ah = 'AB' + ' ' + operatorId + ':' + sign;

    // Construct and return authorization header
    return ah;
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
}
