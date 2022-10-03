import { Module } from '@nestjs/common';
import { SmsMerchantService } from './sms-merchant.service';
import { SmsMerchantController } from './sms-merchant.controller';

@Module({
  controllers: [SmsMerchantController],
  providers: [SmsMerchantService]
})
export class SmsMerchantModule {}
