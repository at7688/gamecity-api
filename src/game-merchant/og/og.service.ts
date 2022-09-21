import {
  BadGatewayException,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { format } from 'date-fns';
import * as FormData from 'form-data';
import * as qs from 'query-string';
import { BetRecordStatus } from 'src/bet-record/enums';
import { GameCategory } from 'src/game/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { v4 as uuidv4 } from 'uuid';
import { GameMerchantService } from '../game-merchant.service';
import { OgReqBase, OgResBase, OG_API_TOKEN } from './types/base';
import { OgCreatePlayerReq, OgCreatePlayerRes } from './types/createPlayer';
import { OgBetRecordsReq, OgBetRecordsRes } from './types/fetchBetRecords';
import { OgGameListReq, OgGameListRes } from './types/gameList';
import { OgGetApiTokenRes } from './types/getApiToken';
import { OgGetBalanceReq, OgGetBalanceRes } from './types/getBalance';
import { OgGetGameKeyReq, OgGetGameKeyRes } from './types/getGameKey';
import { OgGetGameLinkReq, OgGetGameLinkRes } from './types/getGameLink';
import { OgTransferBackReq, OgTransferBackRes } from './types/transferBack';
import { OgTransferToReq, OgTransferToRes } from './types/transferTo';
import { Cache } from 'cache-manager';
@Injectable()
export class OgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  platformCode = 'og';
  apiUrl = 'https://marsapi-test.haa477.com:8443';
  dataFetchUrl = 'https://tigerapi.pwqr820.com:38888';
  operator = 'mog713test';
  key = 'WnnTv4bN7mK8nws7';
  providerId = 30;
  gameCode = 'ogplus';
  usernamePrefix = 'towj_';

  async request<T extends OgResBase>(reqConfig: OgReqBase) {
    const { method, path, data, headers, params } = reqConfig;

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: headers || {
        'X-Token': await this.cacheManager.get(OG_API_TOKEN),
      },
      data,
      params,
    };
    console.log(axiosConfig);
    try {
      const res = await axios.request<T>(axiosConfig);
      console.log(res.data);
      if (res.data.status !== 'success') {
        throw new Error(JSON.stringify(res.data.data));
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
          resData: err.response?.data || err.message,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }
  async recordRequest<T>(reqConfig: OgReqBase) {
    const { method, path, data, headers, params } = reqConfig;

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.dataFetchUrl,
      url: path,
      headers: headers || {
        'X-Token': await this.cacheManager.get(OG_API_TOKEN),
      },
      data: formData,
      params,
    };

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
      return res.data;
    } catch (err) {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.platformCode,
          action: 'ERROR',
          path,
          method,
          sendData: data,
          resData: err.response?.data || err.message,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
    }
  }

  async getApiToken() {
    const reqConfig: OgReqBase = {
      method: 'GET',
      path: '/token',
      headers: {
        'X-Operator': this.operator,
        'X-Key': this.key,
      },
    };

    const res = await this.request<OgGetApiTokenRes>(reqConfig);
    if (!res) {
      throw new BadGatewayException('取得API TOKEN失敗');
    }
    await this.cacheManager.set(OG_API_TOKEN, res.data.token);
    return res.data;
  }

  async createPlayer(player: Player) {
    const reqConfig: OgReqBase<OgCreatePlayerReq> = {
      method: 'POST',
      path: '/register',
      data: {
        username: player.username,
        country: 'Taiwan',
        language: 'cn',
        fullname: `${player.nickname}(ASG)`,
        email: `${player.username}@asg.com`,
        birthdate: '1900-01-01',
      },
    };

    const res = await this.request<OgCreatePlayerRes>(reqConfig);

    if (!res) {
      throw new BadRequestException('帳號新增失敗');
    }

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
    const gameMap = {
      'SPEED BACCARAT': '极速百家乐',
      BACCARAT: '百家乐',
      'NO COMMISSION BACCARAT': '免佣百家乐',
      'NEW DT': '新式龙虎',
      'CLASSIC DT': '经典龙虎',
      MONEYWHEEL: '幸运转盘',
      ROULETTE: '轮盘',
      NIUNIU: '牛牛',
      'GOLDEN FLOWER': '炸金花',
      'THREE CARDS': '幸运金花',
      SICBO: '骰宝',
    };
    await Promise.all(
      Object.entries(gameMap).map(([code, name], i) => {
        return this.prisma.game.upsert({
          where: {
            code_platform_code: {
              code,
              platform_code: this.platformCode,
            },
          },
          create: {
            name,
            sort: i,
            code,
            platform_code: this.platformCode,
            category_code: GameCategory.LIVE,
          },
          update: {
            name,
            category_code: GameCategory.LIVE,
          },
        });
      }),
    );
  }

  async getGameList_temp() {
    const reqConfig: OgReqBase<OgGameListReq> = {
      method: 'GET',
      path: '/games',
    };

    const res = await this.request<OgGameListRes>(reqConfig);
    if (!res) {
      throw new BadGatewayException('遊戲列表撈取失敗');
    }
    await Promise.all(
      res.data.games.map((t, i) => {
        return this.prisma.game.upsert({
          where: {
            code_platform_code: {
              code: t.id.toString(),
              platform_code: this.platformCode,
            },
          },
          create: {
            name: t.name,
            sort: i,
            code: t.id.toString(),
            platform_code: this.platformCode,
            category_code: GameCategory.LIVE,
          },
          update: {
            name: t.name,
            category_code: GameCategory.LIVE,
          },
        });
      }),
    );

    return res;
  }

  async getGameKey(player: Player) {
    const reqConfig: OgReqBase<OgGetGameKeyReq> = {
      method: 'GET',
      path: `/game-providers/${this.providerId}/games/${this.gameCode}/key`,
      params: {
        username: player.username,
      },
    };

    const res = await this.request<OgGetGameKeyRes>(reqConfig);

    if (!res) {
      throw new BadRequestException('獲取遊戲金鑰失敗');
    }

    return res.data.key;
  }
  async getGameLink(game_key: string) {
    const reqConfig: OgReqBase<OgGetGameLinkReq> = {
      method: 'GET',
      path: `/game-providers/${this.providerId}/play`,
      params: {
        key: game_key,
        // type: 'desktop'
      },
    };

    const res = await this.request<OgGetGameLinkRes>(reqConfig);

    if (!res) {
      throw new BadRequestException('獲取遊戲連結失敗');
    }

    return res.data.url;
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANSFER_TO_GAME,
        player_id: player.id,
        amount: -player.balance,
        source: this.platformCode,
        relative_id: trans_id,
      })),
    ]);

    const reqConfig: OgReqBase<OgTransferToReq> = {
      method: 'POST',
      path: `/game-providers/${this.providerId}/balance`,
      data: {
        username: player.username,
        balance: player.balance,
        action: 'IN',
        transferId: trans_id,
      },
    };

    const res = await this.request<OgTransferToRes>(reqConfig);

    if (!res) {
      await this.gameMerchantService.transferToErrorHandle(
        trans_id,
        this.platformCode,
        player,
      );
    }

    // 紀錄轉入
    await this.gameMerchantService.transferRecord(
      player,
      this.platformCode,
      true,
    );

    return res.data;
  }

  async transferBack(player: Player) {
    const balance = await this.getBalance(player);
    const trans_id = uuidv4();

    if (balance > 0) {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.TRANSFER_FROM_GAME,
          player_id: player.id,
          amount: balance,
          source: this.platformCode,
          relative_id: trans_id,
        })),
      ]);
      const reqConfig: OgReqBase<OgTransferBackReq> = {
        method: 'POST',
        path: `/game-providers/${this.providerId}/balance`,
        data: {
          username: player.username,
          balance,
          action: 'OUT',
          transferId: trans_id,
        },
      };

      await this.request<OgTransferBackRes>(reqConfig);
    }

    // 紀錄轉回
    await this.gameMerchantService.transferRecord(
      player,
      this.platformCode,
      false,
    );

    return {
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

    const gameKey = await this.getGameKey(player);

    const gameUrl = await this.getGameLink(gameKey);

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
    const reqConfig: OgReqBase<OgGetBalanceReq> = {
      method: 'GET',
      path: `/game-providers/${this.providerId}/balance`,
      params: {
        username: player.username,
      },
    };
    const res = await this.request<OgGetBalanceRes>(reqConfig);
    if (!res) {
      throw new BadRequestException('獲取餘額失敗');
    }
    return +res.data.balance;
  }

  async fetchBetRecords(start: Date, end: Date) {
    const reqConfig: OgReqBase<OgBetRecordsReq> = {
      method: 'POST',
      path: 'transaction',
      data: {
        Operator: this.operator,
        Key: this.key,
        SDate: format(start, 'yyyy-MM-dd HH:mm:ss'),
        EDate: format(end, 'yyyy-MM-dd HH:mm:ss'),
        Provider: 'ogplus',
      },
    };

    const list = await this.recordRequest<OgBetRecordsRes>(reqConfig);

    if (list?.length) {
      await Promise.all(
        list.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: {
                username: t.membername.replace(this.usernamePrefix, ''),
              },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.gamename,
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
                amount: +t.bettingamount,
                valid_amount: +t.validbet,
                win_lose_amount: +t.winloseamount,
                bet_at: new Date(t.bettingdate),
                // result_at: new Date(t.endAt),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.gamename,
                status: BetRecordStatus.DONE,
                bet_detail: t as unknown as Prisma.InputJsonObject,
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
                status: BetRecordStatus.DONE,
                valid_amount: +t.validbet,
                win_lose_amount: +t.winloseamount,
              },
            });
          } catch (err) {
            console.log(t, err);
          }
        }),
      );
    }

    return list;
  }
}
