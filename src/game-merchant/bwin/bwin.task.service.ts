import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { BwinService } from './bwin.service';

@Injectable()
export class BwinTaskService {
  constructor(private readonly bwinService: BwinService) {}
  private readonly Logger = new Logger(BwinTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    await this.bwinService.fetchBetRecords(
      subMinutes(new Date(), 2),
      new Date(),
    );
    this.Logger.debug('BWIN_FETCH_BET_RECORDS(EVERY_MINUTE)');
  }
}
