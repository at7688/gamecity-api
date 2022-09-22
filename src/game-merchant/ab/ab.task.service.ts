import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(private readonly abService: AbService) {}
  private readonly Logger = new Logger(AbTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    const startAt = subMinutes(new Date(), 2);
    const endAt = new Date();
    await this.abService.fetchBetRecords(startAt, endAt, true);

    this.Logger.debug('AB_FETCH_BET_RECORDS(EVERY_MINUTE)');
  }
}
