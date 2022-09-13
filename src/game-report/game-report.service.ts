import { BadRequestException, Injectable } from '@nestjs/common';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';
import { gameReport } from './raw/gameReport';

@Injectable()
export class GameReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchGameReportsDto) {
    const {
      category_codes,
      game_ids,
      bet_start_at,
      bet_end_at,
      username,
      agent_username,
    } = search;

    let playersByAgent = null;

    if (agent_username) {
      const agent = await this.prisma.member.findUnique({
        where: { username: agent_username },
      });
      if (!agent) {
        throw new BadRequestException('無此代理');
      }
      playersByAgent = await this.prisma.$queryRaw<SubPlayer[]>(
        subPlayers(agent.id),
      );
    }

    const result = await this.prisma.betRecord.groupBy({
      by: ['platform_code'],
      where: {
        bet_at: {
          gte: bet_start_at,
          lte: bet_end_at,
        },

        player: {
          AND: [
            {
              username: {
                contains: username,
              },
            },
            {
              id: {
                in: playersByAgent
                  ? playersByAgent.map((t) => t.id)
                  : undefined,
              },
            },
          ],
        },
        platform: {
          category: {
            code: {
              in: category_codes,
            },
          },
        },

        game: {
          id: {
            in: game_ids,
          },
        },
      },
      _count: { _all: true },
      _sum: { amount: true, valid_amount: true, win_lose_amount: true },
    });
    return result.map((t) => ({
      platform_code: t.platform_code,
      bet_count: t._count._all,
      bet_amount: +t._sum.amount?.toFixed(2) || 0,
      valid_amount: +t._sum.valid_amount?.toFixed(2) || 0,
      win_lose_amount: +t._sum.win_lose_amount?.toFixed(2) || 0,
    }));
  }
}
