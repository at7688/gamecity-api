import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ApplicantModule } from 'src/applicant/applicant.module';
import { PromotionClientController } from './promotion.client.controller';
import { PromotionClientService } from './promotion.client.service';
import { PromotionController } from './promotion.controller';
import { PromotionProcessor } from './promotion.processor';
import { PromotionService } from './promotion.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'promotion',
    }),
    BullModule.registerQueue({
      name: 'applicant',
    }),
    ApplicantModule,
  ],
  controllers: [PromotionController, PromotionClientController],
  providers: [PromotionService, PromotionClientService, PromotionProcessor],
})
export class PromotionModule {}
