import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { compact } from 'lodash';
import { getAllParents, ParentBasic } from 'src/member/raw/getAllParents';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameMerchantService {
  constructor(private readonly prisma: PrismaService) {}

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

  getBetInfo(player: Player, platform_code: string, game_code: string) {
    return Promise.all([
      this.validateGame(platform_code, game_code),
      this.getBetRatios(player, platform_code, game_code),
    ]);
  }

  transferRecord(player: Player, platform_code: string, isTransTo: boolean) {
    return this.prisma.gameAccount.update({
      where: {
        platform_code_player_id: {
          player_id: player.id,
          platform_code,
        },
      },
      data: {
        has_credit: isTransTo,
      },
    });
  }
}
