import { Injectable } from '@nestjs/common';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { DepositStatus, ValidateStatus } from 'src/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawStatus } from 'src/withdraw/enums';
import { getRangeCounts, RangeCountsInfo } from './raw/getRangeCounts';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: 時間區間搜尋
  async getRangeCounts() {
    // 玩家數(期間內有下注的玩家)

    // 儲值金額
    // 出金金額
    // 已領禮包總金額
    // 首存會員數
    // 首存金額
    // 派發禮包數
    const rangeCounts = await this.prisma.$queryRaw<RangeCountsInfo[]>(
      getRangeCounts(),
    );
    return this.prisma.success(rangeCounts[0]);
  }
  async getPlayerCount() {
    // 總會員數
    const count = await this.prisma.player.count();
    return this.prisma.success(count);
  }

  async winloseResult() {
    // 當日輸贏
    const todayResult = await this.prisma.betRecord.aggregate({
      where: {
        bet_at: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
      },
      _sum: {
        amount: true,
        win_lose_amount: true,
      },
    });
    // 本週輸贏
    const thisWeekResult = await this.prisma.betRecord.aggregate({
      where: {
        bet_at: {
          gte: startOfWeek(new Date()),
          lte: endOfWeek(new Date()),
        },
      },
      _sum: {
        amount: true,
        win_lose_amount: true,
      },
    });
    // 上週輸贏
    const lastWeekResult = await this.prisma.betRecord.aggregate({
      where: {
        bet_at: {
          gte: startOfWeek(subWeeks(new Date(), 1)),
          lte: endOfWeek(subWeeks(new Date(), 1)),
        },
      },
      _sum: {
        amount: true,
        win_lose_amount: true,
      },
    });
    // 本月輸贏
    const thisMonthResult = await this.prisma.betRecord.aggregate({
      where: {
        bet_at: {
          gte: startOfMonth(new Date()),
          lte: endOfMonth(new Date()),
        },
      },
      _sum: {
        amount: true,
        win_lose_amount: true,
      },
    });
    return this.prisma.success({
      today: todayResult._sum,
      thisWeek: thisWeekResult._sum,
      lastWeek: lastWeekResult._sum,
      thisMonth: thisMonthResult._sum,
    });
  }

  async getBallCounts() {
    const bankDeposits = await this.prisma.bankDepositRec.count({
      where: { status: DepositStatus.APPLYING },
    });
    const playerCard = await this.prisma.playerCard.count({
      where: { valid_status: ValidateStatus.UNPROCESSED },
    });
    const withdraw = await this.prisma.withdrawRec.count({
      where: { status: WithdrawStatus.APPLYING },
    });
    const applicant = await this.prisma.applicant.count({
      where: { status: ValidateStatus.UNPROCESSED },
    });
  }
}
