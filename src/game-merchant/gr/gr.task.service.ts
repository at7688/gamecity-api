import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMinutes, subHours, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { GrService } from './gr.service';

@Injectable()
export class GrTaskService {
  constructor(
    private readonly grService: GrService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(GrTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async createTicket() {
    this.Logger.warn('GR_CREATE_TICKETS');
    // 未特別寫請求次數和最大搜尋區間
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(30)].map((t) => ({
        platform_code: this.grService.platformCode,
        max_seconds: 60 * 60 * 24 * 31, // 31days
        kept_days: 31,
        valid_at: addMinutes(new Date(), 1),
        expired_at: addMinutes(new Date(), 2),
      })),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    this.Logger.debug('GR_FETCH_BET_RECORDS');
    await this.grService.fetchBetRecords(subMinutes(new Date(), 2), new Date());
  }
}
