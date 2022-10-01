import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecordTicketTask {
  constructor(private readonly prisma: PrismaService) {}
  private readonly Logger = new Logger(RecordTicketTask.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanExpiredTickets() {
    await this.prisma.betRecordTicket.deleteMany({
      where: {
        expired_at: {
          lt: new Date(),
        },
      },
    });
    this.Logger.debug('CLEAN_TICKETS');
  }
}
