import { Module } from '@nestjs/common';
import { PaywayController } from './payway.controller';
import { PaywayService } from './payway.service';

@Module({
  controllers: [PaywayController],
  providers: [PaywayService],
})
export class PaywayModule {}
