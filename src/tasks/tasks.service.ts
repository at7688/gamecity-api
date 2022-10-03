import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async cleanLoginRec() {
    this.logger.debug(CLEAN_LOGON_REC);
    await this.prisma.loginRec.deleteMany({
      where: { login_at: { lt: subMonths(new Date(), 1) } },
    });
  }
}
