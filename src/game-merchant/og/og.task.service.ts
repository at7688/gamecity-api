import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMinutes, subHours, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { OgService } from './og.service';

@Injectable()
export class OgTaskService {
  constructor(
    private readonly ogService: OgService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(OgTaskService.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async createTicket() {
    this.Logger.warn('OG_CREATE_TICKETS');
    // 「測試環境」限制5秒1次, 未特別註明保留天數
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(1)].map((t) => ({
        platform_code: this.ogService.platformCode,
        max_seconds: 60 * 10, // 10m
        kept_days: 360,
        valid_at: addMinutes(new Date(), 1),
        expired_at: addMinutes(new Date(), 2),
      })),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    this.Logger.debug('OG_FETCH_BET_RECORDS');
    await this.ogService.fetchBetRecords(
      subMinutes(new Date(), 2),
      new Date(),
      true,
    );
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async getApiToken() {
    this.Logger.debug('OG_GET_API_TOKEN');
    await this.ogService.getApiToken();
  }
}
