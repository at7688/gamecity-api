import { Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import * as qs from 'query-string';
import { BetRecordStatus } from 'src/bet-record/enums';
import { ResCode } from 'src/errors/enums';
import { GameCategory } from 'src/game/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { v4 as uuidv4 } from 'uuid';
import { GameMerchantService } from '../game-merchant.service';
import { TransferStatus } from '../transfer/enums';
import { AbReqBase, AbResBase } from './types/base';
import { AbCreatePlayerReq, AbCreatePlayerRes } from './types/createPlayer';
import { AbBetRecordsReq, AbBetRecordsRes } from './types/fetchBetRecords';
import { AbGameListReq, AbGameListRes } from './types/gameList';
import { AbGetBalanceReq, AbGetBalanceRes } from './types/getBalance';
import { AbGetGameLinkReq, AbGetGameLinkRes } from './types/getGameLink';
import { AbTransferBackReq, AbTransferBackRes } from './types/transferBack';
import { AbTransferCheckReq, AbTransferCheckRes } from './types/transferCheck';
import { AbTransferToReq, AbTransferToRes } from './types/transferTo';

@Injectable()
export class AbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
  ) {}

  platformCode = 'ab';
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
    try {
      const res = await axios.request<T>(axiosConfig);

      if (!['OK', 'PLAYER_EXIST'].includes(res.data.resultCode)) {
        await this.gameMerchantService.requestErrorHandle(
          this.platformCode,
          path,
          method,
          data,
          res.data,
        );
      }
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
      return res.data;
    } catch (err) {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.platformCode,
          action: 'ERROR',
          path,
          method,
          sendData: data,
          resData: err.response.data || JSON.parse(err.message),
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
      this.prisma.error(ResCode.EXCEPTION_ERR);
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

    return this.prisma.success();
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
      data: res.data?.map((t, i) => ({
        name: t.name,
        sort: i,
        code: t.productId,
        platform_code: this.platformCode,
        category_code: GameCategory.LIVE,
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
      },
    };

    const res = await this.request<AbGetGameLinkRes>(reqConfig);

    return res.data.gameLoginUrl;
  }

  async transferCheck(trans_id: string) {
    const reqConfig: AbReqBase<AbTransferCheckReq> = {
      method: 'POST',
      path: '/GetTransferState',
      data: {
        sn: trans_id,
      },
    };

    const res = await this.request<AbTransferCheckRes>(reqConfig);
    if (res.resultCode === 'TRANS_NOT_EXIST') {
      return TransferStatus.FAILED;
    }
    return {
      0: TransferStatus.PENDING,
      1: TransferStatus.SUCCESS,
      2: TransferStatus.FAILED,
    }[res.data.transferState];
  }

  async transferTo(player: Player) {
    const trans_id = this.operatorId + uuidv4().substring(0, 13);

    const amount = await this.gameMerchantService.beforeTransTo(
      player,
      this.platformCode,
      trans_id,
    );
    if (amount === 0) return;

    const reqConfig: AbReqBase<AbTransferToReq> = {
      method: 'POST',
      path: '/Transfer',
      data: {
        sn: trans_id,
        agent: this.agentAcc,
        amount,
        player: player.username + this.suffix,
        type: 1,
      },
    };

    try {
      const res = await this.request<AbTransferToRes>(reqConfig);

      try {
        await this.gameMerchantService.transToSuccess(trans_id);
      } catch (err) {
        this.prisma.error(ResCode.EXCEPTION_ERR);
      }

      return res;
    } catch (err) {
      await this.gameMerchantService.transferToErrorHandle(
        trans_id,
        this.platformCode,
        player,
      );
      throw err;
    }
  }

  async transferBack(player: Player) {
    const balance = await this.getBalance(player);

    if (balance <= 0) {
      return this.prisma.success(0);
    }

    const trans_id = this.operatorId + uuidv4().substring(0, 13);

    const reqConfig: AbReqBase<AbTransferBackReq> = {
      method: 'POST',
      path: '/Transfer',
      data: {
        sn: trans_id,
        agent: this.agentAcc,
        amount: balance,
        player: player.username + this.suffix,
        type: 0,
      },
    };

    try {
      await this.request<AbTransferBackRes>(reqConfig);

      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANS_FROM_GAME,
          player_id: player.id,
          amount: balance,
          source: this.platformCode,
          relative_id: trans_id,
        })),
      ]);

      await this.gameMerchantService.transBackSuccess(trans_id);

      return this.prisma.success(balance);
    } catch (err) {
      await this.gameMerchantService.transferBackErrorHandle(
        trans_id,
        this.platformCode,
        player,
      );
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

    const gameUrl = await this.getGameLink(player);

    await this.transferTo(player);

    return this.prisma.success(gameUrl);
  }

  async getBalance(player: Player) {
    const reqConfig: AbReqBase<AbGetBalanceReq> = {
      method: 'POST',
      path: '/GetBalances',
      data: {
        agent: this.agentAcc,
        pageSize: 100,
        pageIndex: 1,
        recursion: 0, // 0: 指定代理下的直属玩家 , 1：所有下线玩家
        players: [player.username + this.suffix],
      },
    };
    const res = await this.request<AbGetBalanceRes>(reqConfig);

    return res.data.list[0].amount;
  }

  async fetchBetRecords(start: Date, end: Date, isTask?: boolean) {
    const reqConfig: AbReqBase<AbBetRecordsReq> = {
      method: 'POST',
      path: '/PagingQueryBetRecords',
      data: {
        agent: this.agentAcc,
        startDateTime: format(start, 'yyyy-MM-dd HH:mm:ss'),
        endDateTime: format(end, 'yyyy-MM-dd HH:mm:ss'),
        pageSize: 1000,
        pageNum: 1,
      },
    };

    const res = await this.request<AbBetRecordsRes>(reqConfig);

    await Promise.all(
      res.data.list.map(async (t) => {
        try {
          const player = await this.prisma.player.findUnique({
            where: { username: t.player.replace(this.suffix, '') },
          });
          if (!player) {
            // 略過RAW測試帳號
            return;
          }
          // 上層佔成資訊
          const [game, ratios, vip_water] =
            await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.gameType.toString(),
            );
          await this.prisma.betRecord.upsert({
            where: {
              bet_no_platform_code: {
                bet_no: t.betNum.toString(),
                platform_code: this.platformCode,
              },
            },
            create: {
              bet_no: t.betNum.toString(),
              amount: t.betAmount,
              valid_amount: t.validAmount,
              rolling_amount: t.validAmount * game.nums_rolling,
              win_lose_amount: t.winOrLossAmount,
              bet_at: new Date(t.betTime),
              result_at: new Date(t.gameRoundEndTime),
              player_id: player.id,
              platform_code: this.platformCode,
              category_code: game.category_code,
              game_code: t.gameType.toString(),
              status: {
                110: BetRecordStatus.BETTING,
                111: BetRecordStatus.DONE,
                120: BetRecordStatus.REFUND,
              }[t.status],
              bet_detail: t as unknown as Prisma.InputJsonObject,
              vip_water,
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
            },
            update: {
              bet_detail: t as unknown as Prisma.InputJsonObject,
              status: {
                110: BetRecordStatus.BETTING,
                111: BetRecordStatus.DONE,
                120: BetRecordStatus.REFUND,
              }[t.status],
              amount: t.betAmount,
              valid_amount: t.validAmount,
              win_lose_amount: t.winOrLossAmount,
              rolling_amount: t.validAmount * game.nums_rolling,
            },
          });
        } catch (err) {
          console.log(t, err);
        }
      }),
    );

    if (isTask) {
      await this.prisma.gamePlatform.update({
        where: { code: this.platformCode },
        data: {
          record_check_at: end,
        },
      });
    }

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
