import { PromotionClientController } from './promotion.client.controller';
import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionTaskService } from './promotion.task.service';
import { PromotionClientService } from './promotion.client.service';

@Module({
  controllers: [PromotionController, PromotionClientController],
  providers: [PromotionService, PromotionTaskService, PromotionClientService],
})
export class PromotionModule {}
