import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Player } from '@prisma/client';
import { compact } from 'lodash';
import { getAllParents, ParentBasic } from 'src/member/raw/getAllParents';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { ResCode } from 'src/errors/enums';

@Injectable()
export class GameMerchantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
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
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANS_TO_GAME_CANCELED,
        player_id: player.id,
        amount: player.balance,
        source: platform_code,
        relative_id: trans_id,
        note: '轉入遊戲失敗',
      })),
    ]);
    this.prisma.error(ResCode.TRANS_TO_GAME_ERR, '轉入遊戲失敗');
  }

  async transferBackErrorHandle(
    trans_id,
    platform_code: string,
    player: Player,
  ) {
    await this.prisma.$transaction([
      ...(await this.walletRecService.playerCreate({
        type: WalletRecType.TRANS_FROM_GAME_CANCELED,
        player_id: player.id,
        amount: player.balance,
        source: platform_code,
        relative_id: trans_id,
        note: '遊戲轉回失敗',
      })),
    ]);
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

  transToRec(player: Player, platform_code: string, credit: number) {
    console.log('transToRec', credit);
    return this.prisma.gameAccount.update({
      where: {
        platform_code_player_id: {
          player_id: player.id,
          platform_code,
        },
      },
      data: {
        credit: {
          increment: credit,
        },
      },
    });
  }
  transBackRec(player: Player, platform_code: string, credit: number) {
    console.log('transBackRec', credit);
    return this.prisma.gameAccount.update({
      where: {
        platform_code_player_id: {
          player_id: player.id,
          platform_code,
        },
      },
      data: {
        credit: {
          decrement: credit,
        },
      },
    });
  }
}
