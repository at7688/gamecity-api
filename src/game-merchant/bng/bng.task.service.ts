import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { subHours, subMinutes, addMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { BngService } from './bng.service';

@Injectable()
export class BngTaskService {
  constructor(
    private readonly bngService: BngService,
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly Logger = new Logger(BngTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async createTicket() {
    this.Logger.warn('BNG_CREATE_TICKETS');
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(20)].map((t) => ({
        platform_code: this.bngService.platformCode,
        max_seconds: 60 * 60 * 24, // 24hr
        kept_days: 90,
        valid_at: addMinutes(new Date(), 1),
        expired_at: addMinutes(new Date(), 2),
      })),
    });
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchGameList() {
    this.Logger.debug('BNG_FETCH_BET_RECORDS');
    await this.bngService.fetchBetRecords(
      subMinutes(new Date(), 1),
      new Date(),
      true,
    );
  }
}
