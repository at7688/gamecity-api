import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { AviaService } from './avia.service';

@Injectable()
export class AviaTaskService {
  constructor(private readonly aviaService: AviaService) {}
  private readonly logger = new Logger(AviaTaskService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async fetchQuickBetRecords() {
    await this.aviaService.fetchBetRecords(
      subMinutes(new Date(), 10),
      new Date(),
    );
    this.logger.debug('AVIA_FETCH_BET_RECORDS(EVERY_5_MINUTES)');
  }
  @Cron(CronExpression.EVERY_6_HOURS)
  async fetchBetRecords() {
    await this.aviaService.fetchBetRecords(
      subHours(new Date(), 24),
      subHours(new Date(), 12),
    );
    this.logger.debug('AVIA_FETCH_BET_RECORDS(EVERY_6_HOURS)');
  }
}
