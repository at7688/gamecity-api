import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMinutes, subHours, subMinutes } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { WmService } from './wm.service';

@Injectable()
export class WmTaskService {
  constructor(
    private readonly wmService: WmService,
    private readonly prisma: PrismaService,
  ) {}
  private readonly Logger = new Logger(WmTaskService.name);

  // WM撈單是以間隔計算, 每次撈單後update下次可撈單日期即可

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    this.Logger.debug('WM_FETCH_BET_RECORDS');
    await this.wmService.fetchBetRecords(
      subMinutes(new Date(), 2),
      new Date(),
      true,
    );
  }
}
