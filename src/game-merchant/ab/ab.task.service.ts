import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(private readonly abService: AbService) {}
  private readonly Logger = new Logger(AbTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchGameList() {
    const startAt = subMinutes(new Date(), 7);
    const endAt = new Date();
    await this.abService.fetchBetRecords(startAt, endAt, true);

    this.Logger.debug('BWIN_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
}
