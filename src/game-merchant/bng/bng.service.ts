import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
import { formatRFC3339 } from 'date-fns';
import * as numeral from 'numeral';
import { BetRecordStatus } from 'src/bet-record/enums';
import { ResCode } from 'src/errors/enums';
import { GameCategory } from 'src/game/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { v4 as uuidv4 } from 'uuid';
import { GameMerchantService } from '../game-merchant.service';
import { RecordTicketService } from '../record-ticket/record-ticket.service';
import { TransferStatus } from '../transfer/enums';
import { BngReqBase, BngResBase } from './types/base';
import { BngCreatePlayerReq, BngCreatePlayerRes } from './types/createPlayer';
import { BngBetRecordsReq, BngBetRecordsRes } from './types/fetchBetRecords';
import { BngGameListReq, BngGameListRes } from './types/gameList';
import { BngGetBalanceReq, BngGetBalanceRes } from './types/getBalance';
import { BngGetGameLinkReq, BngGetGameLinkRes } from './types/getGameLink';
import { BngTransferBackReq, BngTransferBackRes } from './types/transferBack';
import {
  BngTransferCheckReq,
  BngTransferCheckRes,
} from './types/transferCheck';
import { BngTransferToReq, BngTransferToRes } from './types/transferTo';

@Injectable()
export class BngService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
    private readonly ticketService: RecordTicketService,
  ) {}
  platformCode = 'bng';

  apiUrl = 'http://game.stgkg.btgame777.com/v2';
  accountId = 535297412469653;
  securityCode = 'fbf5cad36c142ea8a0626c31240c7426';

  usernamePrefix = 'Asg168_';

  async request<T extends BngResBase>(reqConfig: BngReqBase) {
    const { method, path, data } = reqConfig;

    let str = `security_code=${this.securityCode}`;

    Object.keys(data).forEach((key) => {
      str += `&${key}=${data[key]}`;
    });

    const postData = {
      ...data,
      check_code: CryptoJS.MD5(str).toString(),
    };

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      data: postData,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (res.data.status.code !== 1000) {
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
          sendData: postData,
          resData: err.response.data,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
      this.prisma.error(ResCode.EXCEPTION_ERR);
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: BngReqBase<BngCreatePlayerReq> = {
      method: 'POST',
      path: '/agent/create_user',
      data: {
        account_id: this.accountId,
        username: player.username,
        password: CryptoJS.MD5(player.username).toString(),
      },
    };

    try {
      await this.request<BngCreatePlayerRes>(reqConfig);

      // 新增廠商對應遊戲帳號
      await this.prisma.gameAccount.create({
        data: {
          platform_code: this.platformCode,
          player_id: player.id,
          account: player.username,
        },
      });

      return this.prisma.success();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async getGameList() {
    const reqConfig: BngReqBase<BngGameListReq> = {
      method: 'POST',
      path: '/agent/get_gamelist',
      data: {
        account_id: this.accountId,
      },
    };

    const res = await this.request<BngGameListRes>(reqConfig);

    Object.entries(res.data).forEach(async ([key, list]) => {
      await this.prisma.game.createMany({
        data: list.map((t, i) => ({
          name: t.tw,
          sort: i,
          code: t.game_code,
          platform_code: this.platformCode,
          category_code: {
            fish: GameCategory.FISH,
            table: GameCategory.CHESS,
            p2p: GameCategory.CHESS,
            slot: GameCategory.SLOT,
            arcade: GameCategory.STREET,
          }[key],
        })),
        skipDuplicates: true,
      });
    });

    return res;
  }

  async getGameLink(player: Player, game_id: string) {
    const reqConfig: BngReqBase<BngGetGameLinkReq> = {
      method: 'POST',
      path: '/agent/user_login',
      data: {
        account_id: this.accountId,
        username: player.username,
        password: CryptoJS.MD5(player.username).toString(),
        game_code: game_id,
        lang: 'zh-tw',
      },
    };

    try {
      const res = await this.request<BngGetGameLinkRes>(reqConfig);

      return res.data.game_url;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();

    const amount = await this.gameMerchantService.beforeTransTo(
      player,
      this.platformCode,
      trans_id,
    );
    if (amount === 0) return;

    const reqConfig: BngReqBase<BngTransferToReq> = {
      method: 'POST',
      path: '/user/deposit_amount',
      data: {
        account_id: this.accountId,
        username: player.username,
        deposit_amount: amount,
        external_order_id: trans_id,
      },
    };

    try {
      const res = await this.request<BngTransferToRes>(reqConfig);

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

    const trans_id = uuidv4();

    const reqConfig: BngReqBase<BngTransferBackReq> = {
      method: 'POST',
      path: '/user/withdraw_amount',
      data: {
        account_id: this.accountId,
        username: player.username,
        take_all: true,
        external_order_id: trans_id,
      },
    };

    try {
      await this.request<BngTransferBackRes>(reqConfig);

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

  async login(game_id: string, player: Player) {
    if (!game_id) {
      this.prisma.error(ResCode.EMPTY_GAME_CODE, '遊戲不可為空');
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

    const gameUrl = await this.getGameLink(player, game_id);

    await this.transferTo(player);

    return this.prisma.success(gameUrl);
  }

  async getBalance(player: Player) {
    const reqConfig: BngReqBase<BngGetBalanceReq> = {
      method: 'POST',
      path: '/user/get_balance',
      data: {
        account_id: this.accountId,
        username: player.username,
      },
    };
    const res = await this.request<BngGetBalanceRes>(reqConfig);
    return +res.data.balance;
  }

  async transferCheck(trans_id: string) {
    const reqConfig: BngReqBase<BngTransferCheckReq> = {
      method: 'POST',
      path: '/user/get_transaction_status',
      data: {
        account_id: this.accountId,
        external_order_id: trans_id,
      },
    };
    const res = await this.request<BngTransferCheckRes>(reqConfig);

    return {
      pending: TransferStatus.PENDING,
      transferred: TransferStatus.SUCCESS,
    }[res.data.status];
  }

  async fetchBetRecords(start: Date, end: Date) {
    await this.ticketService.useTicket(this.platformCode, start, end);
    const reqConfig: BngReqBase<BngBetRecordsReq> = {
      method: 'POST',
      path: '/record/get_game_histories',
      data: {
        account_id: this.accountId,
        datetime_from: formatRFC3339(start),
        datetime_to: formatRFC3339(end),
        page: 1,
        page_count: 200,
        game_type: 'ALL',
        lang: 'zh-tw',
      },
    };

    const res = await this.request<BngBetRecordsRes>(reqConfig);
    if (res.data.histories?.length) {
      await Promise.all(
        res.data.histories.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.username.replace(this.usernamePrefix, '') },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.game_code,
            );
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.order_id,
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.order_id,
                amount: t.bet,
                valid_amount: t.valid_bet,
                rolling_amount: t.valid_bet * game.nums_rolling,
                win_lose_amount: t.diff,
                bet_at: new Date(t.bet_time),
                result_at: new Date(t.result_time),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.game_code,
                status: BetRecordStatus.DONE,
                bet_detail: t as unknown as Prisma.InputJsonObject,
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
                amount: t.bet,
                valid_amount: t.valid_bet,
                win_lose_amount: t.diff,
                rolling_amount: t.valid_bet * game.nums_rolling,
                bet_detail: t as unknown as Prisma.InputJsonObject,
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
}
