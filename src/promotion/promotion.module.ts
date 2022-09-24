import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionTaskService } from './promotion.task.service';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, PromotionTaskService],
})
export class PromotionModule {}
