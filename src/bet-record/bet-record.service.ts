import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from 'src/wallet-rec/wallet-rec.service';
import { SearchBetRecordsDto } from './dto/search-bet-records.dto';

@Injectable()
export class BetRecordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly walletRecService: WalletRecService,
  ) {}

  findAll(search: SearchBetRecordsDto) {
    const {
      bet_start_at,
      bet_end_at,
      result_start_at,
      result_end_at,
      bet_no,
      username,
      agent_username,
      status,
      category_codes,
      bet_amount_min,
      bet_amount_max,
      win_lose_amount_min,
      win_lose_amount_max,
      win_lose_result,
      game_codes,
    } = search;
    return this.prisma.betRecord.findMany({
      where: {
        bet_at: {
          gte: bet_start_at,
          lte: bet_end_at,
        },
        // bet_at: {
        //   gte: bet_start_at,
        //   lte: bet_end_at,
        // },
      },
    });
  }
}
