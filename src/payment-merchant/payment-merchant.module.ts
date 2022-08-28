import { Module } from '@nestjs/common';
import { PaymentMerchantService } from './payment-merchant.service';
import { PaymentMerchantController } from './payment-merchant.controller';

@Module({
  controllers: [PaymentMerchantController],
  providers: [PaymentMerchantService]
})
export class PaymentMerchantModule {}
