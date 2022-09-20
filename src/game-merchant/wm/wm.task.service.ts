import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { WmService } from './wm.service';

@Injectable()
export class WmTaskService {
  constructor(private readonly wmService: WmService) {}
  private readonly Logger = new Logger(WmTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchGameList() {
    await this.wmService.fetchBetRecords(
      subMinutes(new Date(), 20),
      subMinutes(new Date(), 10),
    );
    this.Logger.debug('WM_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
}
