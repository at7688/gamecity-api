import { Injectable, BadRequestException } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { BetRecordStatus } from 'src/bet-record/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { BwinService } from './bwin.service';
import * as CryptoJS from 'crypto-js';
import { BwinBetReq, BwinResBase } from './types';

interface ReqConfig {
  method: string;
  url: string;
  data: any;
}

interface ResBase {
  success: 1 | 0;
  msg?: string;
  info?: any;
}

@Injectable()
export class BwinCbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
    private readonly bwinService: BwinService,
    private readonly authService: AuthService,
  ) {}

  async getBalance(query): Promise<BwinResBase> {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'getBalance',
        data: query.token,
      },
    });
    const player = await this.getPlayerByToken(query.token);

    if (!player) {
      return {
        data: {
          statusCode: 3,
        },
      };
    }

    return {
      data: await this.getHashCb(player),
    };
  }

  async getHashCb(player: Player) {
    return {
      statusCode: 0,
      username: player.username,
      balance: player.balance * 100,
      hash: CryptoJS.MD5(
        `${this.bwinService.apiKey}${player.username}${player.balance * 100}`,
      ).toString(),
    };
  }

  async betResult(data: BwinBetReq) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'BetResult',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const player = await this.getPlayerByToken(data.token);

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_RESULT,
        player_id: player.id,
        amount: data.amount / 100,
        source: `${this.bwinService.platformCode}/${data.gameId}/${data.productId}`,
        relative_id: data.transactionId.toString(),
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: data.transactionId.toString(),
            platform_code: this.bwinService.platformCode,
          },
        },
        data: {
          status: BetRecordStatus.DONE,
          win_lose_amount: data.amount / 100,
          result_at: new Date(data.roundUpdatedAt),
        },
      }),
    ]);
    return {
      data: await this.getHashCb(player),
    };
  }

  async cancelBetting(data: BwinBetReq): Promise<BwinResBase> {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'CancelBetting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const player = await this.getPlayerByToken(data.token);

    if (!player) {
      return {
        data: {
          statusCode: 3,
        },
      };
    }

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BET_REFUND,
        player_id: player.id,
        amount: data.amount / 100,
        source: `${this.bwinService.platformCode}/${data.gameId}/${data.productId}`,
        relative_id: data.transactionId.toString(),
      })),
      this.prisma.betRecord.update({
        where: {
          bet_no_platform_code: {
            bet_no: data.transactionId.toString(),
            platform_code: this.bwinService.platformCode,
          },
        },
        data: {
          status: BetRecordStatus.REFUND,
          result_at: new Date(data.roundUpdatedAt),
        },
      }),
    ]);
    return {
      data: await this.getHashCb(player),
    };
  }

  async betting(data: BwinBetReq): Promise<BwinResBase> {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const player = await this.getPlayerByToken(data.token);

    if (!player) {
      return {
        data: {
          statusCode: 3,
        },
      };
    }

    const record = await this.prisma.betRecord.findUnique({
      where: {
        bet_no_platform_code: {
          bet_no: data.transactionId.toString(),
          platform_code: this.bwinService.platformCode,
        },
      },
    });

    if (!record) {
      await this.prisma.$transaction([
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.BETTING,
          player_id: player.id,
          amount: -data.amount / 100,
          source: `${this.bwinService.platformCode}/${data.gameId}/${data.productId}`,
          relative_id: data.transactionId.toString(),
        })),
        this.prisma.betRecord.create({
          data: {
            bet_no: data.transactionId.toString(),
            amount: data.amount / 100,
            bet_at: data.roundCreatedAt,
            player_id: player.id,
            platform_code: this.bwinService.platformCode,
          },
        }),
      ]);
    }

    const newPlayer = await this.prisma.player.findUnique({
      where: { username: player.username },
    });

    return {
      data: await this.getHashCb(newPlayer),
    };
  }

  async getPlayerByToken(token) {
    const info = this.authService.playerValidate(token);
    if (!info) {
      throw new BadRequestException('Token is Invalid');
    }
    return this.prisma.player.findUnique({
      where: { username: info.username },
    });
  }

  async playerValidate(query): Promise<BwinResBase> {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'PlayerValidate',
        data: query.token,
      },
    });

    const player = await this.getPlayerByToken(query.token);

    if (!player) {
      return {
        data: {
          statusCode: 1,
        },
        error: {
          title: 'TOKEN_IS_NULL',
          description: 'Token is null',
        },
      };
    }

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.bwinService.platformCode,
        action: 'PlayerValidateResponse',
        data: {
          data: await this.getHashCb(player),
        },
      },
    });

    return {
      data: await this.getHashCb(player),
    };
  }
}
