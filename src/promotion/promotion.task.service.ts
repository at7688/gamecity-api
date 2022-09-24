import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { SettlementType } from './enums';
import { PromotionService } from './promotion.service';

@Injectable()
export class PromotionTaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly promotionService: PromotionService,
  ) {}
}
