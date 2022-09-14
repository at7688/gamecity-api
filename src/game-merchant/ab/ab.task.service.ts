import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(private readonly abService: AbService) {}
  private readonly logger = new Logger(AbTaskService.name);

  @Cron(CronExpression.EVERY_30_SECONDS)
  async fetchQuickBetRecords() {
    await this.abService.fetchBetRecords(subMinutes(new Date(), 1));
    this.logger.debug('AB_FETCH_BET_RECORDS(EVERY_MINUTE)');
  }
}
