import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { compact } from 'lodash';
import * as numeral from 'numeral';
import { BetRecordStatus } from 'src/bet-record/enums';
import { getAllParents, ParentBasic } from 'src/member/raw/getAllParents';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { OgService } from './og.service';
import { OgReqConfig, OgTransferType } from './types';
import { OgBetRes } from './types/bet';
import { OgBetResultRes } from './types/betResult';
import { OgCancelBetRes } from './types/cancelBet';
import { OgPromotionRes } from './types/promotion';
import { OgValidationReq } from './types/validation';

@Injectable()
export class OgCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly ogService: OgService,
    private readonly gameMerchantService: GameMerchantService,
  ) {}

  async authenticate(data: OgValidationReq, headers) {
    const platform_code = this.ogService.platformCode;
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: 'Authenticate',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const res = {
      player_status: 'activate',
      rs_code: 'S-100',
      rs_message: 'success',
      token: data.token,
    };
    console.log(data);

    return res;
  }

  async getBalance(username: string, headers) {
    const reqConfig: OgReqConfig = {
      method: 'GET',
      path: `/GetBalance/${username}`,
      data: '',
    };
    await this.ogService.signValidation(reqConfig, headers);

    const player = await this.prisma.player.findUnique({
      where: {
        username: username.replace(this.ogService.suffix, ''),
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

  async cancelTransfer(data: OgCancelBetRes, headers) {
    const reqConfig: OgReqConfig = {
      method: 'POST',
      path: `/CancelTransfer`,
      data,
    };
    await this.ogService.signValidation(reqConfig, headers);

    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.ogService.platformCode,
        action: 'CancelTransfer',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.player.replace(this.ogService.suffix, ''),
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    const detail = data.originalDetails[0];

    const record = await this.prisma.betRecord.findFirst({
      where: {
        bet_no: detail.betNum.toString(),
        platform_code: this.ogService.platformCode,
        status: BetRecordStatus.BETTING,
      },
    });

    if (record) {
      await this.prisma.$transaction([
        this.prisma.betRecord.update({
          where: { id: record.id },
          data: {
            status: BetRecordStatus.REFUND,
            // result_at: new Date(),
          },
        }),
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.BET_REFUND,
          player_id: player.id,
          amount: -record.amount,
          source: `${this.ogService.platformCode}/${data.originalDetails[0].betNum}`,
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
  async transfer(data, headers) {
    const reqConfig: OgReqConfig = {
      method: 'POST',
      path: `/Transfer`,
      data,
    };
    await this.ogService.signValidation(reqConfig, headers);

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.player.replace(this.ogService.suffix, ''),
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    switch (data.type) {
      case OgTransferType.BETTING:
        return await this.betting(data, player);
      case OgTransferType.BET_RESULT:
        return await this.betResult(data, player);
      case OgTransferType.PROMOTION:
        return await this.promotion(data, player);

      default:
        break;
    }
  }

  async promotion(data: OgPromotionRes, player: Player) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.ogService.platformCode,
        action: 'Promotion',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const detail = data.details[0];

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.GAME_GIFT,
        player_id: player.id,
        amount: data.amount,
        source: `${this.ogService.platformCode}/${data.type}/${detail.eventRecordNum}`,
        relative_id: data.tranId.toString(),
      })),
    ]);
    return {
      resultCode: 0,
      message: null,
      balance: numeral(player.balance).add(data.amount).value(),
      version: new Date().getTime(),
    };
  }

  async betResult(data: OgBetResultRes, player: Player) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.ogService.platformCode,
        action: 'BetResult',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const bet = data.details[0];
    const record = await this.prisma.betRecord.findUnique({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.ogService.platformCode,
        },
      },
    });
    if (!record) {
      await this.prisma.betRecord.create({
        data: {
          bet_no: bet.betNum.toString(),
          amount: bet.betAmount,
          bet_target: bet.betType.toString(),
          bet_at: new Date(bet.betTime),
          player_id: player.id,
          platform_code: this.ogService.platformCode,
          category_code: this.ogService.categoryCode,
          game_code: bet.gameType.toString(),
          status: BetRecordStatus.REFUND,
          bet_detail: bet as unknown as Prisma.InputJsonObject,
        },
      });
      return {
        resultCode: 10007,
        message: '不列記錄',
        balance: numeral(player.balance).add(data.amount).value(),
        version: new Date().getTime(),
      };
    }
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_RESULT,
        player_id: player.id,
        amount: data.amount,
        source: `${this.ogService.platformCode}/${data.type}/${bet.betNum}`,
        relative_id: bet.betNum.toString(),
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: bet.betNum.toString(),
            platform_code: this.ogService.platformCode,
          },
        },
        data: {
          status: BetRecordStatus.DONE,
          win_lose_amount: bet.winOrLossAmount,
          valid_amount: bet.validAmount,
          result_at: new Date(bet.gameRoundEndTime),
        },
      }),
    ]);
    return {
      resultCode: 0,
      message: null,
      balance: numeral(player.balance).add(data.amount).value(),
      version: new Date().getTime(),
    };
  }

  async betting(data: OgBetRes, player: Player, action?: string) {
    const platform_code = this.ogService.platformCode;

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: action || 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const bet = data.details[0];

    const game_code = bet.gameType.toString();

    // 上層佔成資訊
    const [category_code, ratios] = await this.gameMerchantService.getBetInfo(
      player,
      platform_code,
      game_code,
    );

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BETTING,
        player_id: player.id,
        amount: data.amount,
        source: `${platform_code}/${data.type}/${bet.gameType}`,
        relative_id: bet.betNum.toString(),
      })),
      this.prisma.betRecord.upsert({
        where: {
          bet_no_platform_code: {
            bet_no: bet.betNum.toString(),
            platform_code,
          },
        },
        create: {
          bet_no: bet.betNum.toString(),
          amount: bet.betAmount,
          bet_target: bet.betType.toString(),
          bet_at: new Date(bet.betTime),
          player_id: player.id,
          platform_code,
          category_code,
          game_code,
          ratios: {
            createMany: {
              data: ratios.map((t) => ({
                agent_id: t.agent_id,
                ratio: t.ratio,
              })),
              skipDuplicates: true,
            },
          },
        },
        update: {
          amount: bet.betAmount,
          bet_target: bet.betType.toString(),
          bet_at: new Date(bet.betTime),
          player_id: player.id,
        },
      }),
    ]);
    return {
      resultCode: 0,
      message: null,
      balance: numeral(player.balance).add(data.amount).value(),
      version: new Date().getTime(),
    };
  }
}
