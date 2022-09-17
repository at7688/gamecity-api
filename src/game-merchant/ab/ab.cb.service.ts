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
import { AbService } from './ab.service';
import { AbReqConfig, AbTransferType } from './types';
import { AbBetRes } from './types/bet';
import { AbBetResultRes } from './types/betResult';
import { AbCancelBetRes } from './types/cancelBet';
import { AbPromotionRes } from './types/promotion';

@Injectable()
export class AbCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly abService: AbService,
    private readonly gameMerchantService: GameMerchantService,
  ) {}

  async getBalance(username: string, headers) {
    const reqConfig: AbReqConfig = {
      method: 'GET',
      path: `/GetBalance/${username}`,
      data: '',
    };
    await this.abService.signValidation(reqConfig, headers);

    const player = await this.prisma.player.findUnique({
      where: {
        username: username.replace(this.abService.suffix, ''),
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

  async cancelTransfer(data: AbCancelBetRes, headers) {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: `/CancelTransfer`,
      data,
    };
    await this.abService.signValidation(reqConfig, headers);

    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.abService.platformCode,
        action: 'CancelTransfer',
        sendData: data as unknown as Prisma.InputJsonObject,
      },
    });

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.player.replace(this.abService.suffix, ''),
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
        platform_code: this.abService.platformCode,
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
          source: `${this.abService.platformCode}/${data.originalDetails[0].betNum}`,
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
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: `/Transfer`,
      data,
    };
    await this.abService.signValidation(reqConfig, headers);

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.player.replace(this.abService.suffix, ''),
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    switch (data.type) {
      case AbTransferType.BETTING:
        return await this.betting(data, player);
      case AbTransferType.BET_RESULT:
        return await this.betResult(data, player);
      case AbTransferType.PROMOTION:
        return await this.promotion(data, player);

      default:
        break;
    }
  }

  async promotion(data: AbPromotionRes, player: Player) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.abService.platformCode,
        action: 'Promotion',
        sendData: data as unknown as Prisma.InputJsonObject,
      },
    });

    const detail = data.details[0];

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.GAME_GIFT,
        player_id: player.id,
        amount: data.amount,
        source: `${this.abService.platformCode}/${data.type}/${detail.eventRecordNum}`,
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

  async betResult(data: AbBetResultRes, player: Player) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.abService.platformCode,
        action: 'BetResult',
        sendData: data as unknown as Prisma.InputJsonObject,
      },
    });
    const bet = data.details[0];
    const record = await this.prisma.betRecord.findUnique({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.abService.platformCode,
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
          platform_code: this.abService.platformCode,
          category_code: this.abService.categoryCode,
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
        source: `${this.abService.platformCode}/${data.type}/${bet.betNum}`,
        relative_id: bet.betNum.toString(),
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: bet.betNum.toString(),
            platform_code: this.abService.platformCode,
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

  async betting(data: AbBetRes, player: Player, action?: string) {
    const platform_code = this.abService.platformCode;

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: action || 'Betting',
        sendData: data as unknown as Prisma.InputJsonObject,
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
