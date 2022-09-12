import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GrService } from './gr.service';
import {
  GrBalanceCbReq,
  GrCbRes,
  GrTradeCheckCbReq,
  GrTransferCbReq,
  GrTransferType,
} from './types';

@Injectable()
export class GrCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly grService: GrService,
  ) {}

  async getBalance(data: GrBalanceCbReq): Promise<GrCbRes> {
    const isValid = await this.grService.signValidation(data);
    if (!isValid) {
      return {
        success: 0,
        msg: '驗證不合法',
      };
    }

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.UserName,
      },
    });

    if (!player) {
      return {
        success: 0,
        msg: '玩家帳號不存在',
        info: null,
      };
    }

    return {
      success: 1,
      msg: null,
      info: {
        Balance: player.balance,
      },
    };
  }

  async transfer(data: GrTransferCbReq): Promise<GrCbRes> {
    const isValid = await this.grService.signValidation(data);
    if (!isValid) {
      return {
        success: 0,
        msg: '驗證不合法',
      };
    }

    const player = await this.prisma.player.findUnique({
      where: {
        username: data.UserName,
      },
    });

    if (!player) {
      return {
        success: 0,
        msg: '玩家帳號不存在',
      };
    }

    switch (data.Type) {
      case GrTransferType.BETTING:
        return this.betting(data, player.id);
      case GrTransferType.BET_RESULT:
        return this.betResult(data, player.id);
      case GrTransferType.PROMOTION:
        return this.promotion(data, player.id);
      case GrTransferType.BET_RESULT_MANUAL:
        return this.reSettle(data, player.id);
      case GrTransferType.BET_REFUND:
        return this.refund(data, player.id);
    }
  }

  async promotion(data: GrTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'Promotion',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.GAME_GIFT,
        player_id,
        amount: +data.Money,
        source: `${this.grService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }
  async reSettle(data: GrTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'ReSettle',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const tradeID = data.ID.split('-')[0];

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type:
          +data.Money > 0 ? WalletRecType.MANUAL_ADD : WalletRecType.MANUAL_SUB,
        player_id,
        amount: +data.Money,
        source: `${this.grService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: tradeID,
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: tradeID,
            platform_code: this.grService.platformCode,
          },
        },
        data: {
          status: BetRecordStatus.DONE,
          win_lose_amount: +data.Money,
          result_at: new Date(+data.Timestamp),
        },
      }),
    ]);

    return {
      success: 1,
      msg: '',
    };
  }
  async refund(data: GrTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'Refund',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_REFUND,
        player_id,
        amount: +data.Money,
        source: `${this.grService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }

  async betResult(data: GrTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'BetResult',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_RESULT,
        player_id,
        amount: +data.Money,
        source: `${this.grService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }

  async betting(data: GrTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BETTING,
        player_id,
        amount: +data.Money,
        source: `${this.grService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
      this.prisma.betRecord.create({
        data: {
          bet_no: data.ID,
          amount: -data.Money,
          bet_at: new Date(+data.Timestamp),
          player_id,
          platform_code: this.grService.platformCode,
        },
      }),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }

  async tradeCheck(data: GrTradeCheckCbReq) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.grService.platformCode,
        action: 'TradeCheck',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const record = await this.prisma.betRecord.findUnique({
      where: {
        bet_no_platform_code: {
          bet_no: data.ID,
          platform_code: this.grService.platformCode,
        },
      },
    });
    if (!record) {
      return {
        success: 1,
        msg: '',
        info: {
          Exists: 0,
        },
      };
    }
    return {
      success: 1,
      msg: '',
      info: {
        Exists: 1,
      },
    };
  }
}
