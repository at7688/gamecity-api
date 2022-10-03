import { Module } from '@nestjs/common';
import { SmsMerchantService } from './sms-merchant.service';
import { SmsMerchantController } from './sms-merchant.controller';
import { Every8dService } from './every8d/every8d.service';
import { Every8dTask } from './every8d/every8d.task';

@Module({
  controllers: [SmsMerchantController],
  providers: [SmsMerchantService, Every8dService, Every8dTask],
  exports: [SmsMerchantService],
})
export class SmsMerchantModule {}
