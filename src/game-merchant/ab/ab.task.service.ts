import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subMinutes, addMinutes } from 'date-fns';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(
    private readonly abService: AbService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(AbTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    const startAt = subMinutes(new Date(), 2);
    const endAt = new Date();
    await this.abService.fetchBetRecords(startAt, endAt, true);

    this.Logger.debug('AB_FETCH_BET_RECORDS');
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async createTicket() {
    await this.prisma.betRecordTicket.createMany({
      data: [...Array(8)].map((t) => ({
        platform_code: this.abService.platformCode,
        max_range: 60 * 60, // 1hr
        in_days: 90,
        expired_at: addMinutes(new Date(), 1),
      })),
    });
    this.Logger.warn('AB_CREATE_TICKETS');
  }
}
