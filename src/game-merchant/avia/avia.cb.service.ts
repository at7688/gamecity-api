import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { AviaService } from './avia.service';
import {
  AviaBalanceCbReq,
  AviaCbRes,
  AviaTransferCbReq,
  AviaTransferType,
} from './types';

@Injectable()
export class AviaCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly aviaService: AviaService,
  ) {}

  async getBalance(data: AviaBalanceCbReq, headers): Promise<AviaCbRes> {
    const isValid = await this.aviaService.signValidation(data);
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

  async transfer(data: AviaTransferCbReq, headers): Promise<AviaCbRes> {
    const isValid = await this.aviaService.signValidation(data);
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
      case AviaTransferType.BETTING:
        return this.betting(data, player.id);
      case AviaTransferType.BET_RESULT:
        return this.betResult(data, player.id);
      case AviaTransferType.PROMOTION:
        return this.promotion(data, player.id);
    }
    return {
      success: 0,
      msg: 'ERROR',
    };
  }

  async promotion(data: AviaTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.aviaService.platformCode,
        action: 'Promotion',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    return {
      success: 1,
      msg: '',
    };
  }

  async betResult(data: AviaTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.aviaService.platformCode,
        action: 'BetResult',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_RESULT,
        player_id,
        amount: +data.Money,
        source: `${this.aviaService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: data.ID,
            platform_code: this.aviaService.platformCode,
          },
        },
        data: {
          status: BetRecordStatus.DONE,
          win_lose_amount: +data.Money,
        },
      }),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }

  async betting(data: AviaTransferCbReq, player_id: string) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.aviaService.platformCode,
        action: 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BETTING,
        player_id,
        amount: +data.Money,
        source: `${this.aviaService.platformCode}/${data.Type}/${data.Description}`,
        relative_id: data.ID,
      })),
      this.prisma.betRecord.create({
        data: {
          bet_no: data.ID,
          amount: -data.Money,
          bet_at: new Date(+data.Timestamp),
          player_id,
          platform_code: this.aviaService.platformCode,
        },
      }),
    ]);
    return {
      success: 1,
      msg: '',
    };
  }
}
