import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getUnixTime } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { GameMerchantService } from '../game-merchant.service';
import { OgService } from './og.service';
import { OgBetReq } from './types/bet';
import { OgBetResultReq } from './types/betResult';
import { OgGetBalanceReq } from './types/getBalance';
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
    const { player_id, token } = data;

    const player = await this.prisma.player.findUnique({
      where: {
        id: player_id,
      },
    });

    if (!player) {
      throw new BadRequestException('玩家帳號不存在');
    }

    return {
      player_status: 'activate',
      rs_code: 'S-100',
      rs_message: 'success',
      token: data.token,
    };
  }

  async getBalance(data: OgGetBalanceReq, headers) {
    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: this.ogService.platformCode,
        action: 'GetBalance',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const { player_id } = data;

    const player = await this.prisma.player.findUnique({
      where: {
        id: player_id,
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    return {
      player_status: 'activate',
      rs_code: 'S-100',
      rs_message: 'success',
      player_id: player.id,
      balance: player.balance,
      timestamp: getUnixTime(new Date()),
      currency: 'TWD',
    };
  }

  async betting(data: OgBetReq, header) {
    const platform_code = this.ogService.platformCode;

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: 'Betting',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const { player_id } = data;

    const player = await this.prisma.player.findUnique({
      where: {
        id: player_id,
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    // // 上層佔成資訊
    // const [category_code, ratios] = await this.gameMerchantService.getBetInfo(
    //   player,
    //   platform_code,
    //   game_code,
    // );

    await Promise.all(
      data.records.map(async (bet) => {
        await this.prisma.$transaction([
          ...(await this.walletRecService.playerCreate({
            type: WalletRecType.BETTING,
            player_id: player.id,
            amount: -bet.amount,
            source: `${platform_code}/${data.transaction_type}/${bet.bet_place}`,
            relative_id: bet.transaction_id,
          })),
          this.prisma.betRecord.create({
            data: {
              bet_no: bet.transaction_id,
              amount: +bet.amount,
              bet_target: bet.bet_place,
              bet_at: new Date(data.called_at * 1000),
              player_id: player.id,
              platform_code,
              category_code: this.ogService.categoryCode,
              // game_code,
              // ratios: {
              //   createMany: {
              //     data: ratios.map((t) => ({
              //       agent_id: t.agent_id,
              //       ratio: t.ratio,
              //     })),
              //     skipDuplicates: true,
              //   },
              // },
            },
          }),
        ]);
      }),
    );

    return {
      rs_code: 'S-100',
      rs_message: 'success',
      player_id: player.id,
      total_amount: data.total_amount,
      updated_balance: player.balance,
      records: JSON.stringify(
        data.records.map((t) => ({
          amount: t.amount,
          transaction_id: t.transaction_id,
        })),
      ),
      billing_at: getUnixTime(new Date()),
    };
  }

  async betResult(data: OgBetResultReq, header) {
    const platform_code = this.ogService.platformCode;

    // 暫時紀錄Log
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: 'BetResult',
        data: data as unknown as Prisma.InputJsonObject,
      },
    });

    const { player_id } = data;

    const player = await this.prisma.player.findUnique({
      where: {
        id: player_id,
      },
    });

    if (!player) {
      return {
        resultCode: 10003,
        message: '玩家帳號不存在',
      };
    }

    // // 上層佔成資訊
    // const [category_code, ratios] = await this.gameMerchantService.getBetInfo(
    //   player,
    //   platform_code,
    //   game_code,
    // );

    // await Promise.all(
    //   data.records.map(async (bet) => {
    //     await this.prisma.$transaction([
    //       ...(await this.walletRecService.playerCreate({
    //         type: WalletRecType.BETTING,
    //         player_id: player.id,
    //         amount: -bet.amount,
    //         source: `${platform_code}/${data.transaction_type}/${bet.bet_place}`,
    //         relative_id: bet.transaction_id,
    //       })),
    //       this.prisma.betRecord.create({
    //         data: {
    //           bet_no: bet.transaction_id,
    //           amount: +bet.amount,
    //           bet_target: bet.bet_place,
    //           bet_at: new Date(data.called_at * 1000),
    //           player_id: player.id,
    //           platform_code,
    //           category_code: this.ogService.categoryCode,
    //           // game_code,
    //           // ratios: {
    //           //   createMany: {
    //           //     data: ratios.map((t) => ({
    //           //       agent_id: t.agent_id,
    //           //       ratio: t.ratio,
    //           //     })),
    //           //     skipDuplicates: true,
    //           //   },
    //           // },
    //         },
    //       }),
    //     ]);
    //   }),
    // );

    return {
      rs_code: 'S-100',
      rs_message: 'success',
      player_id: player.id,
      amount: data.amount,
      transaction_id: data.transaction_id,
      updated_balance: player.balance,
      billing_at: getUnixTime(new Date()),
    };
  }
}
