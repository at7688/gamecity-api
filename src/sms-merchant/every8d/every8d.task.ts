import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { Every8dService } from './every8d.service';

export class Every8dTask {
  constructor(
    private readonly prisma: PrismaService,
    private readonly every8dService: Every8dService,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async getToken() {
    await this.every8dService.getToken();
  }
}
