import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SearchBetRecordsDto } from './dto/search-bet-records.dto';

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
      game_codes,
      page,
      perpage,
    } = search;
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
          username: {
            contains: username,
          },
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
        game_code: {
          in: game_codes,
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
