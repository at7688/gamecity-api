import { BadRequestException, Injectable } from '@nestjs/common';
import { Player, Prisma } from '@prisma/client';
import { compact } from 'lodash';
import * as numeral from 'numeral';
import { BetRecordStatus } from 'src/bet-record/enums';
import { getAllParents, ParentBasic } from 'src/member/raw/getAllParents';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
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
        data: data as unknown as Prisma.InputJsonObject,
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
        data: data as unknown as Prisma.InputJsonObject,
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
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const bet = data.details[0];
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

  async betting(data: AbBetRes, player: Player) {
    const platform_code = this.abService.platformCode;

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });
    const bet = data.details[0];

    const game_code = bet.gameType.toString();

    // 確認該遊戲有設定值
    const game = await this.prisma.game.findUnique({
      where: {
        code_platform_code: {
          platform_code,
          code: game_code,
        },
      },
    });

    if (!game) {
      throw new BadRequestException('該遊戲未有設定值');
    }

    // 上層佔成資訊
    const agents = await this.prisma.$queryRaw<ParentBasic[]>(
      getAllParents(player.agent_id),
    );
    const ratios = await Promise.all(
      agents.map((t) =>
        this.prisma.gameRatio.findUnique({
          where: {
            platform_code_game_code_agent_id: {
              platform_code,
              game_code: game.code,
              agent_id: t.id,
            },
          },
        }),
      ),
    );
    const filteredRatios = compact(ratios);
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.BETTING,
        player_id: player.id,
        amount: data.amount,
        source: `${platform_code}/${data.type}/${bet.betNum}`,
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
          game_code: game.code,
          ratios: {
            createMany: {
              data: filteredRatios.map((t) => ({
                agent_id: t.agent_id,
                ratio: t.ratio,
              })),
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
