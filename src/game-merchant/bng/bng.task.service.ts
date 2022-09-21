import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { BngService } from './bng.service';

@Injectable()
export class BngTaskService {
  constructor(private readonly bngService: BngService) {}
  private readonly Logger = new Logger(BngTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchGameList() {
    await this.bngService.fetchBetRecords(
      subMinutes(new Date(), 7),
      new Date(),
    );
    this.Logger.debug('BNG_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
}
