import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { Queue } from 'bull';
import { compact } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { getAllParents, ParentBasic } from 'src/member/raw/getAllParents';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType, WalletStatus } from 'src/wallet-rec/enums';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { TransferQueue } from './types';

@Injectable()
export class GameMerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,

    @InjectQueue('transfer')
    private readonly transferQueue: Queue<TransferQueue>,
  ) {}

  async validateGame(platform_code: string, game_code: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        code_platform_code: {
          platform_code,
          code: game_code,
        },
      },
    });

    if (!game) {
      throw new BadRequestException(`無此遊戲 [${game_code}]`);
    }
    return game;
  }

  async getBetRatios(player: Player, platform_code: string, game_code: string) {
    // 上層佔成資訊
    const agents = await this.prisma.$queryRaw<ParentBasic[]>(
      getAllParents(player?.agent_id),
    );
    const ratios = await Promise.all(
      agents.map((t) =>
        this.prisma.gameRatio.findUnique({
          where: {
            platform_code_game_code_agent_id: {
              platform_code,
              game_code,
              agent_id: t.id,
            },
          },
        }),
      ),
    );
    return compact(ratios);
  }

  async requestErrorHandle(
    platform_code: string,
    path: string,
    method: string,
    sendData,
    resData: any,
  ) {
    await this.prisma.merchantLog.create({
      data: {
        merchant_code: platform_code,
        action: 'ERROR',
        path,
        method,
        sendData,
        resData,
      },
    });

    this.prisma.error(ResCode.GAME_MERCHANT_ERR, JSON.stringify(resData));
  }

  async transferToErrorHandle(trans_id, platform_code: string, player: Player) {
    await this.transferQueue.add(
      'transTo',
      {
        platform_code,
        trans_id,
        player_id: player.id,
        retryTimes: 1,
      },
      {
        delay: 1000 * 10,
      },
    );
    this.prisma.error(ResCode.TRANS_TO_GAME_ERR, '轉入遊戲失敗, 排程確認中');
  }

  async transferBackErrorHandle(
    trans_id,
    platform_code: string,
    player: Player,
  ) {
    // await this.prisma.$transaction([
    //   ...(await this.walletRecService.playerCreate({
    //     type: WalletRecType.TRANS_FROM_GAME_CANCELED,
    //     player_id: player.id,
    //     amount: player.balance,
    //     source: platform_code,
    //     relative_id: trans_id,
    //     note: '遊戲轉回失敗',
    //   })),
    // ]);
    this.prisma.error(ResCode.TRANS_FROM_GAME_ERR, '遊戲轉回失敗');
  }

  async getVipWater(player: Player, platform_code: string, game_code: string) {
    const vipWater = await this.prisma.gameWater.findFirst({
      where: { vip_id: player.vip_id, platform_code, game_code },
    });
    return vipWater?.water || 0;
  }

  getBetInfo(player: Player, platform_code: string, game_code: string) {
    return Promise.all([
      this.validateGame(platform_code, game_code),
      this.getBetRatios(player, platform_code, game_code),
      this.getVipWater(player, platform_code, game_code),
    ]);
  }

  async beforeTransTo(
    _player: Player,
    platform_code: string,
    trans_id: string,
  ) {
    const player = await this.prisma.player.findUnique({
      where: { id: _player.id },
    });

    if (player.balance <= 0) {
      return;
    }

    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANS_TO_GAME,
        player_id: player.id,
        amount: -player.balance,
        source: platform_code,
        relative_id: trans_id,
        status: WalletStatus.PROCESSING,
      })),
    ]);
  }

  async transToSuccess(trans_id: string) {
    const record = await this.prisma.walletRec.findFirst({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_TO_GAME,
      },
    });

    // 紀錄遊戲端帳號餘額
    await this.prisma.gameAccount.update({
      where: {
        platform_code_player_id: {
          player_id: record.player_id,
          platform_code: record.source,
        },
      },
      data: {
        credit: {
          increment: Math.abs(record.amount),
        },
      },
    });

    // 更新錢包狀態為「完成」
    await this.prisma.walletRec.updateMany({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_TO_GAME,
      },
      data: {
        status: WalletStatus.DONE,
      },
    });
  }
  async transBackSuccess(trans_id: string) {
    const record = await this.prisma.walletRec.findFirst({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_FROM_GAME,
      },
    });

    // 紀錄遊戲端帳號餘額
    await this.prisma.gameAccount.update({
      where: {
        platform_code_player_id: {
          player_id: record.player_id,
          platform_code: record.source,
        },
      },
      data: {
        credit: {
          decrement: Math.abs(record.amount),
        },
      },
    });

    // 更新錢包狀態為「完成」
    await this.prisma.walletRec.updateMany({
      where: {
        relative_id: trans_id,
        type: WalletRecType.TRANS_FROM_GAME,
      },
      data: {
        status: WalletStatus.DONE,
      },
    });
  }
}
