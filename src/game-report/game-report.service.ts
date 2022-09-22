import { BadRequestException, Injectable } from '@nestjs/common';
import { BetRecordStatus } from 'src/bet-record/enums';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';

@Injectable()
export class GameReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    groupBy: 'platform_code' | 'category_code',
    search: SearchGameReportsDto,
  ) {
    const {
      category_codes,
      game_ids,
      bet_start_at,
      bet_end_at,
      username,
      agent_username,
      status,
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
      by: [groupBy],
      where: {
        status: {
          in: status,
        },
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
        game: {
          id: {
            in: game_ids,
          },
          category: {
            code: {
              in: category_codes,
            },
          },
        },
      },
      _count: { _all: true },
      _sum: { amount: true, valid_amount: true, win_lose_amount: true },
    });
    return result.map((t) => ({
      category_code: t.category_code,
      platform_code: t.platform_code,
      bet_count: t._count._all,
      bet_amount: +t._sum.amount?.toFixed(2) || 0,
      valid_amount: +t._sum.valid_amount?.toFixed(2) || 0,
      win_lose_amount: +t._sum.win_lose_amount?.toFixed(2) || 0,
    }));
  }

  winLoseReport(search: SearchGameReportsDto) {
    //
  }
}
