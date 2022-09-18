import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { AbService } from './ab.service';

@Injectable()
export class AbTaskService {
  constructor(private readonly abService: AbService) {}
  private readonly Logger = new Logger(AbTaskService.name);

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async fetchGameList() {
  //   await this.abService.fetchBetRecords(
  //     subMinutes(new Date(), 20),
  //     subMinutes(new Date(), 10),
  //   );
  //   this.Logger.debug('BWIN_FETCH_BET_RECORDS(EVERY_10_MINUTES)');
  // }
}
