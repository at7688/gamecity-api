import { PaywayClientController } from './payway.client.controller';
import { Module } from '@nestjs/common';
import { PaywayService } from './payway.service';
import { PaywayController } from './payway.controller';
import { PaywayClientService } from './payway.client.service';

@Module({
  controllers: [PaywayController, PaywayClientController],
  providers: [PaywayService, PaywayClientService],
})
export class PaywayModule {}
