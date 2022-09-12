import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { orderBy } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { BwinGameListRes, BwinResBase } from './types';

interface ReqConfig {
  method: string;
  url: string;
  data?: any;
  query?: any;
}

@Injectable()
export class BwinService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}
  platformCode = 'bwin';
  apiUrl = 'https://api-stage.at888888.com/service';
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTU2NywidXNlcklkIjoxNDk5LCJwYXNzd29yZCI6IiQyYiQwNSRtTUNlWEdRWi5US1R6UVFLcEFLY0ouVHNleVhYc2ltN05qdkFYNnVLc3hJT3ZmVlIzZUtFbSIsInVzZXJuYW1lIjoia2lkdWx0Iiwic3ViIjowLCJjdXJyZW5jeSI6IlRXRCIsInBhcmVudElkIjoxLCJpYXQiOjE2NjI5ODU1MzksImV4cCI6OTAwNzIwMDkxNzcyNjUzMH0.ky-Eh9E7giLMFGArXFK11Yis2-qqa8Y0rOMvIoBXelg';
  apiKey = '0f12914a-4714-4ed8-8248-2b2cfb473578';

  async request<T extends BwinResBase>(
    reqConfig: ReqConfig,
    playerToken?: string,
  ) {
    const { method, url, data } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url,
      headers: {
        Authorization: 'Bearer ' + this.token,
      },
      data,
    };
    // console.log(axiosConfig);
    try {
      const res = await axios.request<T>(axiosConfig);
      if (res.data.error) {
        throw new Error(res.data.error.message);
      }
      return res.data;
    } catch (err) {
      console.log('Error :' + err.message);
      throw new BadRequestException(err.message);
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: ReqConfig = {
      method: 'POST',
      url: '/api/v1/players',
      data: {
        username: player.username,
        nickname: player.nickname,
      },
    };

    try {
      const result = await this.request(reqConfig);

      // if (result?.error) {
      //   throw new BadRequestException(result.msg);
      // }

      if (result?.data) {
        // 新增廠商對應遊戲帳號
        return this.prisma.gameAccount.create({
          data: {
            platform_code: this.platformCode,
            player_id: player.id,
            account: player.username,
          },
        });
      }
    } catch (err) {
      throw err;
    }
  }

  async login(gameUrl: string, player: Player, playerToken: string) {
    if (!gameUrl) {
      throw new BadRequestException('gameUrl為空');
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

    return {
      url: `${gameUrl}&token=${playerToken}&lang=zh`,
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
  async gameList(playerToken: string) {
    const reqConfig: ReqConfig = {
      method: 'GET',
      url: '/api/v1/games',
      query: {
        type: 'all',
        lang: 'zh',
      },
    };
    const res = await this.request<BwinGameListRes>(reqConfig, playerToken);
    return res;
  }
}
