import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { PromotionStatus } from './enums';
import { PromotionService } from './promotion.service';

@Injectable()
export class PromotionTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionService: PromotionService,
  ) {}
  private readonly Logger = new Logger(PromotionTaskService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async updateStatus() {
    this.Logger.warn('Fetch promotion status');
    await Promise.all([
      this.prisma.promotion.updateMany({
        where: {
          start_at: {
            lte: new Date(),
          },
          end_at: {
            gte: new Date(),
          },
          status: {
            not: PromotionStatus.RUNING,
          },
        },
        data: {
          status: PromotionStatus.RUNING,
        },
      }),
      this.prisma.promotion.updateMany({
        where: {
          end_at: {
            lte: new Date(),
          },
          status: {
            not: PromotionStatus.END,
          },
        },
        data: {
          status: PromotionStatus.END,
        },
      }),
      this.prisma.promotion.updateMany({
        where: {
          start_at: {
            gte: new Date(),
          },
          status: {
            not: PromotionStatus.COMMING,
          },
        },
        data: {
          status: PromotionStatus.COMMING,
        },
      }),
    ]);
  }
}
