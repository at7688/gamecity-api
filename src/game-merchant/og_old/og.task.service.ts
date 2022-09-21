import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { OgService } from './og.service';

@Injectable()
export class OgTaskService {
  constructor(private readonly ogService: OgService) {}
  private readonly logger = new Logger(OgTaskService.name);

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async fetchQuickBetRecords() {
  //   await this.ogService.fetchBetRecords(subMinutes(new Date(), 1));
  //   this.logger.debug('OG_FETCH_BET_RECORDS(EVERY_MINUTE)');
  // }
}
