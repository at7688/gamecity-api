import { BadRequestException, Injectable } from '@nestjs/common';
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
import { AbReqBase, AbResBase } from './types/base';
import { AbCreatePlayerReq, AbCreatePlayerRes } from './types/createPlayer';
import { AbBetRecordsReq, AbBetRecordsRes } from './types/fetchBetRecords';
import { AbGameListReq, AbGameListRes } from './types/gameList';
import { AbGetBalanceReq, AbGetBalanceRes } from './types/getBalance';
import { AbGetGameLinkReq, AbGetGameLinkRes } from './types/getGameLink';
import { AbTransferBackReq, AbTransferBackRes } from './types/transferBack';
import { AbTransferToReq, AbTransferToRes } from './types/transferTo';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}

  platformCode = 'ab';
  categoryCode = 'LIVE';
  operatorId = '1716859';
  apiUrl = 'https://sw2.apidemo.net:8443';
  allBetKey =
    'EJFgM6QtUmF5xz/Gx1ToY3qVfxoRpuC2OnjRIDjN4eJ9t7n220Iux+pGyDurf6BKMDqHO0S6SJ9kBgPl2hnYCg==';
  partnerKey =
    'FZe/OUOURWKfYTtJFsoUGsXIvsk1uh8BBe9VjjmK3+9SAAGjHN3ECbMqKnV4KV0oRAVDFfU8DW0h+zYd0iT3lg==';
  contentType = 'application/json; charset=UTF-8';
  agentAcc = '7euwaa';
  suffix = 'hiq';
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

  getAuthorizationHeader(reqConfig: AbReqBase) {
    const { method, path, md5, date } = reqConfig;

    const stringToSign =
      method + '\n' + md5 + '\n' + this.contentType + '\n' + date + '\n' + path;

    return this.getAuthBySignString(stringToSign, this.allBetKey);
  }

  async request<T extends AbResBase>(reqConfig: AbReqBase) {
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
    console.log(axiosConfig);
    try {
      const res = await axios.request<T>(axiosConfig);
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
      if (!['OK', 'PLAYER_EXIST'].includes(res.data.resultCode)) {
        throw new BadRequestException(res.data.message);
      }
      return res.data;
    } catch (err) {
      // await this.prisma.merchantLog.create({
      //   data: {
      //     merchant_code: this.platformCode,
      //     action: 'ERROR',
      //     path,
      //     method,
      //     sendData: data,
      //     resData: err,
      //   },
      // });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: AbReqBase<AbCreatePlayerReq> = {
      method: 'POST',
      path: '/CheckOrCreate',
      data: {
        agent: this.agentAcc,
        player: player.username + this.suffix,
      },
    };

    await this.request<AbCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: player.username,
      },
    });

    return {
      success: true,
    };
  }

  async getGameList() {
    const query = qs.stringify({
      type: 'all',
      lang: 'zh',
    });
    const reqConfig: AbReqBase<AbGameListReq> = {
      method: 'GET',
      path: `/api/v1/games?${query}`,
    };

    const res = await this.request<AbGameListRes>(reqConfig);

    await this.prisma.game.createMany({
      data: res.data.map((t, i) => ({
        name: t.name,
        sort: i,
        code: t.productId,
        platform_code: this.platformCode,
      })),
      skipDuplicates: true,
    });

    return res;
  }

  async getGameLink(player: Player) {
    const reqConfig: AbReqBase<AbGetGameLinkReq> = {
      method: 'POST',
      path: '/Login',
      data: {
        player: player.username + this.suffix,
        language: 'zh_TW',
        returnUrl: 'https://gamecityad.kidult.one/login',
      },
    };

    const res = await this.request<AbGetGameLinkRes>(reqConfig);

    return res.data.gameLoginUrl;
  }

  async transferTo(player: Player) {
    const [walletRec] = await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_TO_GAME,
        player_id: player.id,
        amount: -player.balance,
        source: this.platformCode,
      })),
    ]);

    const reqConfig: AbReqBase<AbTransferToReq> = {
      method: 'POST',
      path: '/api/v1/players/deposit',
      data: {
        transactionId: walletRec.id,
        amount: player.balance,
        player: player.username,
      },
    };

    const res = await this.request<AbTransferToRes>(reqConfig);

    if (res.resultCode !== 'OK') {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANSFER_FROM_GAME,
          player_id: player.id,
          amount: player.balance,
          source: this.platformCode,
          relative_id: walletRec.id,
          note: '轉入遊戲失敗',
        })),
      ]);
    }

    return res.data;
  }

  async transferBack(player: Player) {
    const balance = await this.getBalance(player);

    const [walletRec] = await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_FROM_GAME,
        player_id: player.id,
        amount: balance,
        source: this.platformCode,
      })),
    ]);

    if (balance > 0) {
      const reqConfig: AbReqBase<AbTransferBackReq> = {
        method: 'POST',
        path: '/api/v1/players/withdraw',
        data: {
          transactionId: walletRec.id,
          amount: balance,
          player: player.username,
        },
      };

      await this.request<AbTransferBackRes>(reqConfig);
    }

    return {
      success: true,
      balance, // 轉回的餘額
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

    const gameUrl = await this.getGameLink(player);

    const currentPlayer = await this.prisma.player.findUnique({
      where: { id: player.id },
    });

    if (currentPlayer.balance) {
      await this.transferTo(currentPlayer);
    }

    return {
      path: gameUrl,
    };
  }

  async getBalance(player: Player) {
    const reqConfig: AbReqBase<AbGetBalanceReq> = {
      method: 'GET',
      path: `/api/v1/players?player=${player.username}`,
    };
    const res = await this.request<AbGetBalanceRes>(reqConfig);
    return res.data[0].balance;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const query = qs.stringify({
      start: getUnixTime(start) * 1000,
      end: getUnixTime(end) * 1000,
      pageSize: 10000,
    });
    const reqConfig: AbReqBase<AbBetRecordsReq> = {
      method: 'GET',
      path: `/api/v1/profile/rounds?${query}`,
    };

    const res = await this.request<AbBetRecordsRes>(reqConfig);

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
          const [category_code, ratios] =
            await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.productId.toString(),
            );
          await this.prisma.betRecord.upsert({
            where: {
              bet_no_platform_code: {
                bet_no: t.id.toString(),
                platform_code: this.platformCode,
              },
            },
            create: {
              bet_no: t.id.toString(),
              amount: t.bet,
              valid_amount: t.validBet,
              win_lose_amount: t.win,
              bet_at: new Date(t.createdAt),
              player_id: player.id,
              platform_code: this.platformCode,
              category_code: this.categoryCode,
              game_code: t.productId,
              status: {
                playing: BetRecordStatus.BETTING,
                finish: BetRecordStatus.DONE,
                cancel: BetRecordStatus.REFUND,
              }[t.status],
              bet_detail: t as unknown as Prisma.InputJsonObject,
              ratios: {
                createMany: {
                  data: ratios.map((r) => ({
                    agent_id: r.agent_id,
                    ratio: r.ratio,
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
              valid_amount: t.validBet,
              win_lose_amount: t.result,
            },
          });
        } catch (err) {
          console.log(t, err);
        }
      }),
    );

    return res;
  }
  async fetchBetRecord(bet_no: string) {
    const reqConfig: AbReqBase = {
      method: 'POST',
      path: '/QueryBetRecordByBetNum',
      data: {
        betNum: bet_no,
      },
    };

    return this.request(reqConfig);
  }
}
