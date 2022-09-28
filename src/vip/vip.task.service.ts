import { Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { VipService } from './vip.service';

export class VipTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vipService: VipService,
  ) {}
  private readonly Logger = new Logger(VipTaskService.name);

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async conditionCheck() {
    await this.vipService.conditionCheck();

    this.Logger.warn('VIP_CONDITION_CHECK');
  }
}
