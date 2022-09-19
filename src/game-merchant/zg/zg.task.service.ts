import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subHours, subMinutes } from 'date-fns';
import { ZgService } from './zg.service';

@Injectable()
export class ZgTaskService {
  constructor(private readonly zgService: ZgService) {}
  private readonly Logger = new Logger(ZgTaskService.name);

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async fetchGameList() {
  //   await this.zgService.fetchBetRecords(
  //     subMinutes(new Date(), 20),
  //     subMinutes(new Date(), 10),
  //   );
  //   this.Logger.debug('GR_FETCH_BET_RECORDS(EVERY_10_MINUTES)');
  // }
}
