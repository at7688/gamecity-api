import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { OgService } from './og.service';

@Injectable()
export class OgTaskService {
  constructor(private readonly ogService: OgService) {}
  private readonly Logger = new Logger(OgTaskService.name);

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async getApiToken() {
  //   await this.ogService.getApiToken();
  //   this.Logger.debug('OG_GET_API_TOKEN(EVERY_10_MINUTES)');
  // }
  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchGameList() {
    await this.ogService.fetchBetRecords(subMinutes(new Date(), 7), new Date());
    this.Logger.debug('OG_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
}
