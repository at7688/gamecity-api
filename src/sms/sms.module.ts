import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SmsMerchantModule } from 'src/sms-merchant/sms-merchant.module';
import { PhoneCodeProcessor } from './phone-code.processor';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [
    SmsMerchantModule,
    BullModule.registerQueue({
      name: 'phone',
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService, PhoneCodeProcessor],
})
export class SmsModule {}
