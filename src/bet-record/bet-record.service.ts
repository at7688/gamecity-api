import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SubPlayer, subPlayers } from 'src/player/raw/subPlayers';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SearchBetRecordsDto } from './dto/search-bet-records.dto';
import { BetRecordStatus } from './enums';

@Injectable()
export class BetRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  async findAll(search: SearchBetRecordsDto) {
    const {
      bet_start_at,
      bet_end_at,
      result_start_at,
      result_end_at,
      bet_no,
      username,
      status,
      category_codes,
      bet_amount_min,
      bet_amount_max,
      win_lose_amount_min,
      win_lose_amount_max,
      game_ids,
      agent_username,
      page,
      perpage,
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

    const findManyArgs: Prisma.BetRecordFindManyArgs = {
      where: {
        bet_at: {
          gte: bet_start_at,
          lte: bet_end_at,
        },
        result_at: {
          gte: result_start_at,
          lte: result_end_at,
        },
        bet_no: {
          contains: bet_no,
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
        status: {
          in: status,
        },
        platform: {
          category: {
            code: {
              in: category_codes,
            },
          },
        },
        amount: {
          gte: bet_amount_min,
          lte: bet_amount_max,
        },
        win_lose_amount: {
          gte: win_lose_amount_min,
          lte: win_lose_amount_max,
        },
        game: {
          id: {
            in: game_ids,
          },
        },
      },
      include: {
        player: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
        game: {
          include: {
            platform: true,
          },
        },
        ratios: {
          select: {
            ratio: true,
            agent: {
              select: {
                id: true,
                username: true,
                nickname: true,
                layer: true,
              },
            },
          },
          orderBy: {
            agent: {
              layer: 'asc',
            },
          },
        },
      },
      orderBy: [
        {
          bet_at: 'desc',
        },
        {
          result_at: 'desc',
        },
      ],
      take: perpage,
      skip: (page - 1) * perpage,
    };
    return this.prisma.listFormat({
      items: await this.prisma.betRecord.findMany(findManyArgs),
      count: await this.prisma.betRecord.count({
        where: findManyArgs.where,
      }),
      search,
    });
  }
}
