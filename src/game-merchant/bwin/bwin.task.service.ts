import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { BwinService } from './bwin.service';

@Injectable()
export class BwinTaskService {
  constructor(private readonly bwinService: BwinService) {}
  private readonly Logger = new Logger(BwinTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchGameList() {
    await this.bwinService.fetchBetRecords(
      subMinutes(new Date(), 7),
      new Date(),
    );
    this.Logger.debug('BWIN_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
}
