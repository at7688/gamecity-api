import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { GrService } from './gr.service';

@Injectable()
export class GrTaskService {
  constructor(private readonly grService: GrService) {}
  private readonly Logger = new Logger(GrTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchGameList() {
    await this.grService.fetchBetRecords(subMinutes(new Date(), 2), new Date());
    this.Logger.debug('GR_FETCH_BET_RECORDS(EVERY_MINUTE)');
  }
}
