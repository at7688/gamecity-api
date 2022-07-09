import { Module } from '@nestjs/common';
import { ActivityPromoService } from './activity-promo.service';
import { ActivityPromoController } from './activity-promo.controller';

@Module({
  controllers: [ActivityPromoController],
  providers: [ActivityPromoService]
})
export class ActivityPromoModule {}
