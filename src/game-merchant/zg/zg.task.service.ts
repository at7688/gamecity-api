import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMinutes, addSeconds, subHours, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { ZgService } from './zg.service';

@Injectable()
export class ZgTaskService {
  constructor(
    private readonly zgService: ZgService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(ZgTaskService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async createTicket() {
    this.Logger.warn('ZG_CREATE_TICKETS');
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(5)].map((t) => ({
        platform_code: this.zgService.platformCode,
        max_seconds: 60 * 60, // 1hr
        kept_days: 7,
        valid_at: addSeconds(new Date(), 10),
        expired_at: addSeconds(new Date(), 20),
      })),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    this.Logger.debug('ZG_FETCH_BET_RECORDS');
    await this.zgService.fetchBetRecords(subMinutes(new Date(), 2), new Date());
  }
}
