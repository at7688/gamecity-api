import { BadRequestException, Injectable } from '@nestjs/common';
import { BetRecordStatus } from 'src/bet-record/enums';
import { ResCode } from 'src/errors/enums';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchAgentReportDto } from './dto/search-agent-report.dto';
import { SearchGameReportsDto } from './dto/search-game-reports.dto';
import { SearchPlayerReportDto } from './dto/search-player-report.dto';
import { agentReport } from './raw/agentReport';
import { gameReport } from './raw/gameReport';
import { playerReport } from './raw/playerReport';

@Injectable()
export class GameReportService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search: SearchGameReportsDto) {
    const {
      group_by,
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
        this.prisma.error(ResCode.NOT_FOUND, '無此代理');
      }
      playersByAgent = await this.prisma.$queryRaw<SubPlayer[]>(
        subPlayers(agent.id),
      );
    }

    const result = await this.prisma.$queryRaw(gameReport(search));

    return this.prisma.success(result);
  }

  async winLoseReport(search: SearchAgentReportDto) {
    const {
      category_codes,
      game_ids,
      bet_start_at,
      bet_end_at,
      username,
      agent_username,
      layers,
      parent_id,
    } = search;

    let playersByAgent = null;

    if (agent_username) {
      const agent = await this.prisma.member.findUnique({
        where: { username: agent_username },
      });
      if (!agent) {
        this.prisma.error(ResCode.NOT_FOUND, '無此代理');
      }
      playersByAgent = await this.prisma.$queryRaw<SubPlayer[]>(
        subPlayers(agent.id),
      );
    }
    if (parent_id) {
      playersByAgent = await this.prisma.$queryRaw<SubPlayer[]>(
        subPlayers(parent_id),
      );
    }
    const betRecords = await this.prisma.betRecord.findMany({
      select: { id: true },
      where: {
        status: BetRecordStatus.DONE,
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
    });
    const agents = await this.prisma.member.findMany({
      where: {
        username: { contains: agent_username },
        layer: {
          in: layers,
        },
        parent_id,
      },
    });
    const agent_ids = agents.map((t) => t.id);
    const bet_ids = betRecords.map((t) => t.id);
    const list = await (agent_ids.length
      ? this.prisma.$queryRaw(agentReport(agent_ids, bet_ids))
      : []);

    return this.prisma.success(list);
  }

  async playerReport(search: SearchPlayerReportDto) {
    const result = await this.prisma.$queryRaw(playerReport(search));
    return this.prisma.success(result);
  }
}
