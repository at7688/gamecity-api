import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addSeconds, subHours, subMinutes, addMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { BwinService } from './bwin.service';

@Injectable()
export class BwinTaskService {
  constructor(
    private readonly bwinService: BwinService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(BwinTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async createTicket() {
    this.Logger.warn('BWIN_CREATE_TICKETS');
    // 每個IP每分鐘限制呼叫60次, 未特別寫保留天數
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(30)].map((t) => ({
        platform_code: this.bwinService.platformCode,
        max_seconds: 60 * 60 * 24 * 7, // 7days
        kept_days: 360,
        valid_at: addMinutes(new Date(), 1),
        expired_at: addMinutes(new Date(), 2),
      })),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    this.Logger.debug('BWIN_FETCH_BET_RECORDS');
    await this.bwinService.fetchBetRecords(
      subMinutes(new Date(), 2),
      new Date(),
      true,
    );
  }
}
