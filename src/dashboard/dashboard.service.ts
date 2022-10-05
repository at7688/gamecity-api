import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
    return rangeCounts[0];
  }
  getPlayerCount() {
    // 總會員數
  }

  winloseResult() {
    // 當日輸贏
    // 本週輸贏
    // 上週輸贏
    // 本月輸贏
  }
}
