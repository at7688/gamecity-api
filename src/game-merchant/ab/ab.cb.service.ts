import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as numeral from 'numeral';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AbService } from './ab.service';
import {
  AbBetDetail,
  AbBetResultDetail,
  AbCancelTransferResData,
  AbEventDetail,
  AbReqConfig,
  AbTransferResData,
  AbTransferType,
} from './types';

@Injectable()
export class AbCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly abService: AbService,
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

  async cancelTransfer(data: AbCancelTransferResData, headers) {
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
        data: { data, headers } as unknown as Prisma.InputJsonObject,
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

    const record = await this.prisma.walletRec.findFirst({
      where: {
        relative_id: data.originalTranId.toString(),
      },
    });

    if (record) {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.BET_REFUND,
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
  async transfer(data: AbTransferResData, headers) {
    const reqConfig: AbReqConfig = {
      method: 'POST',
      path: `/Transfer`,
      data,
    };
    await this.abService.signValidation(reqConfig, headers);

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.abService.platformCode,
        action: 'Transfer',
        data: { data, headers } as unknown as Prisma.InputJsonObject,
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

    const detail = data.details[0];

    let type: WalletRecType;

    switch (data.type) {
      case AbTransferType.BETTING:
        type = WalletRecType.BETTING;
        await this.betting(detail, player.id);
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
        await this.betResult(detail as AbBetResultDetail);
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

        await this.prisma.$transaction([
          ...(await this.walletRecService.playerCreate({
            type,
            player_id: player.id,
            amount: data.amount,
            source: `ab/${data.type}/${
              (detail as unknown as AbEventDetail).eventRecordNum
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

  async promotion(event: AbEventDetail, player_id: string) {
    //
  }

  async betResult(bet: AbBetResultDetail) {
    await this.prisma.betRecord.update({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.abService.platformCode,
        },
      },
      data: {
        status: BetRecordStatus.DONE,
        win_lose_amount: bet.winOrLossAmount,
      },
    });
  }

  async betting(bet: AbBetDetail, player_id: string) {
    await this.prisma.betRecord.upsert({
      where: {
        bet_no_platform_code: {
          bet_no: bet.betNum.toString(),
          platform_code: this.abService.platformCode,
        },
      },

      create: {
        bet_no: bet.betNum.toString(),
        amount: bet.betAmount,
        bet_target: bet.betType.toString(),
        bet_at: new Date(bet.betTime),
        player_id,
        platform_code: this.abService.platformCode,
        game_code: bet.gameType.toString(),
      },
      update: {
        bet_no: bet.betNum.toString(),
        amount: bet.betAmount,
        bet_target: bet.betType.toString(),
        bet_at: new Date(bet.betTime),
        player_id,
        platform_code: this.abService.platformCode,
        game_code: bet.gameType.toString(),
      },
    });
  }
}
