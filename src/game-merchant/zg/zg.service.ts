import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';
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
import { ZgReqBase, ZgResBase } from './types/base';
import { ZgCreatePlayerReq, ZgCreatePlayerRes } from './types/createPlayer';
import { ZgBetRecordsReq, ZgBetRecordsRes } from './types/fetchBetRecords';
import { ZgGameListRes } from './types/gameList';
import { ZgGetBalanceReq, ZgGetBalanceRes } from './types/getBalance';
import { ZgGetGameLinkReq, ZgGetGameLinkRes } from './types/getGameLink';
import { ZgTransferBackReq, ZgTransferBackRes } from './types/transferBack';
import { ZgTransferCheckReq, ZgTransferCheckRes } from './types/transferCheck';
import { ZgTransferToReq, ZgTransferToRes } from './types/transferTo';

@Injectable()
export class ZgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameMerchantService: GameMerchantService,
    private readonly walletRecService: WalletRecService,
    private readonly ticketService: RecordTicketService,
  ) {}
  platformCode = 'zg';
  apiUrl = 'https://api.sandsys.pw';
  channel = '34937514';
  aesKey = '6vEG7IFphbkM59eOPdyofBQSgXYUzZlJ';
  signKey = 'SxzIAbNGWfnqmHKL7tY8dFCuX6VR1wjP';

  agentAcc = 'ASG0001UAT';

  suffix = 'asg';

  async request<T extends ZgResBase>(reqConfig: ZgReqBase) {
    const { method, path, data } = reqConfig;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.aesKey,
    ).toString();

    const sign = CryptoJS.MD5(encrypted + this.signKey).toString();

    const encrptedData = {
      channel: this.channel,
      data: encrypted,
      sign,
    };

    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      data: encrptedData,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      // console.log(res.data);
      if (res.data.result.msg === 'UNDER MAINTENANCE') {
        await this.gameMerchantService.maintenance(this.platformCode);
        this.prisma.error(ResCode.MAINTENANCE);
      }
      if (res.data.result.code !== 1) {
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
          resData: err.response.data,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
      this.prisma.error(ResCode.EXCEPTION_ERR);
    }
  }

  async createPlayer(player: Player) {
    const reqConfig: ZgReqBase<ZgCreatePlayerReq> = {
      method: 'POST',
      path: '/v1/member/create',
      data: {
        agent: this.agentAcc,
        account: player.username,
        password: CryptoJS.MD5(player.username).toString(),
      },
    };

    await this.request<ZgCreatePlayerRes>(reqConfig);

    // 新增廠商對應遊戲帳號
    await this.prisma.gameAccount.create({
      data: {
        platform_code: this.platformCode,
        player_id: player.id,
        account: `${player.username}@${this.suffix}`,
      },
    });

    return this.prisma.success();
  }

  async getGameList() {
    const reqConfig: ZgReqBase = {
      method: 'POST',
      path: '/v1/config/get_game_info_state_list',
      data: {},
    };

    const res = await this.request<ZgGameListRes>(reqConfig);

    await this.prisma.game.createMany({
      data: res.game_info_state_list.map((t, i) => ({
        name: t.names.zh_cn,
        sort: i,
        code: t.id,
        platform_code: this.platformCode,
        category_code: {
          1: GameCategory.FISH,
          3: GameCategory.SLOT,
          4: GameCategory.STREET,
        }[t.type],
      })),
      skipDuplicates: true,
    });

    return res;
  }

  async getGameLink(player: Player, game_id: string) {
    if (!game_id) {
      this.prisma.error(ResCode.EMPTY_GAME_CODE, '遊戲不可為空');
    }
    const reqConfig: ZgReqBase<ZgGetGameLinkReq> = {
      method: 'POST',
      path: '/v1/member/login_game',
      data: {
        account: player.username,
        game_id,
        lang: 'zh_cn',
        agent: this.agentAcc,
      },
    };

    const res = await this.request<ZgGetGameLinkRes>(reqConfig);

    return res.url;
  }

  async transferCheck(trans_id: string) {
    const record = await this.prisma.walletRec.findFirst({
      where: {
        type: {
          in: [WalletRecType.TRANS_TO_GAME, WalletRecType.TRANS_FROM_GAME],
        },
        source: this.platformCode,
        relative_id: trans_id,
      },
      include: {
        player: {
          select: {
            username: true,
          },
        },
      },
    });
    const reqConfig: ZgReqBase<ZgTransferCheckReq> = {
      method: 'POST',
      path: '/v1/trans/verify',
      data: {
        agent: this.agentAcc,
        account: record.player.username,
        serial: trans_id,
      },
    };
    const res = await this.request<ZgTransferCheckRes>(reqConfig);
    if (res.result.code === 1) {
      return TransferStatus.SUCCESS;
    }
    if (res.result.code === 6) {
      return TransferStatus.FAILED;
    }

    return TransferStatus.PENDING;
  }

  async transferTo(player: Player) {
    const trans_id = uuidv4();
    const amount = await this.gameMerchantService.beforeTransTo(
      player,
      this.platformCode,
      trans_id,
    );
    if (amount === 0) return;

    const reqConfig: ZgReqBase<ZgTransferToReq> = {
      method: 'POST',
      path: '/v1/trans/transfer',
      data: {
        serial: trans_id,
        agent: this.agentAcc,
        account: player.username,
        amount: amount.toString(),
        oper_type: 1,
      },
    };

    try {
      const res = await this.request<ZgTransferToRes>(reqConfig);

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

    const reqConfig: ZgReqBase<ZgTransferBackReq> = {
      method: 'POST',
      path: '/v1/trans/transfer',
      data: {
        serial: trans_id,
        agent: this.agentAcc,
        account: player.username,
        amount: balance.toString(),
        oper_type: 0,
      },
    };

    try {
      await this.request<ZgTransferBackRes>(reqConfig);

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
    const reqConfig: ZgReqBase<ZgGetBalanceReq> = {
      method: 'POST',
      path: '/v1/trans/check_balance',
      data: {
        account: player.username,
        agent: this.agentAcc,
      },
    };
    const res = await this.request<ZgGetBalanceRes>(reqConfig);
    if (!res) {
      throw new BadRequestException('轉回餘額失敗');
    }

    return +res.balance;
  }

  async fetchBetRecords(start: Date, end: Date) {
    await this.ticketService.useTicket(this.platformCode, start, end);

    const reqConfig: ZgReqBase<ZgBetRecordsReq> = {
      method: 'POST',
      path: '/v1/record/get_bet_records',
      data: {
        finish_time: {
          start_time: start,
          end_time: end,
        },
        index: 0,
        limit: 5000,
      },
    };

    const res = await this.request<ZgBetRecordsRes>(reqConfig);
    if (res?.rows?.length) {
      await Promise.all(
        res.rows.map(async (t) => {
          try {
            const player = await this.prisma.player.findUnique({
              where: { username: t.member },
            });
            if (!player) {
              // 略過RAW測試帳號
              return;
            }
            const winLoseAmount = numeral(t.payout_amount)
              .subtract(t.bet_amount)
              .value();
            // 上層佔成資訊
            const [game, ratios] = await this.gameMerchantService.getBetInfo(
              player,
              this.platformCode,
              t.game_id.toString(),
            );
            await this.prisma.betRecord.upsert({
              where: {
                bet_no_platform_code: {
                  bet_no: t.id,
                  platform_code: this.platformCode,
                },
              },
              create: {
                bet_no: t.id,
                amount: t.bet_amount,
                valid_amount: t.valid_amount,
                rolling_amount: t.valid_amount * game.nums_rolling,
                win_lose_amount: winLoseAmount,
                bet_at: new Date(t.bet_at),
                result_at: new Date(t.finish_at),
                player_id: player.id,
                platform_code: this.platformCode,
                category_code: game.category_code,
                game_code: t.game_id,
                status: {
                  1: BetRecordStatus.DONE,
                  2: BetRecordStatus.REFUND,
                  3: BetRecordStatus.REFUND,
                  4: BetRecordStatus.REFUND,
                  5: BetRecordStatus.REFUND,
                }[t.status],
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
                amount: t.bet_amount,
                valid_amount: t.valid_amount,
                rolling_amount: t.valid_amount * game.nums_rolling,
                win_lose_amount: winLoseAmount,
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
