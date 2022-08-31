import { MerchantOrderService } from './../merchant-order/merchant-order.service';
import { Module } from '@nestjs/common';
import { PaymentDepositService } from './payment-deposit.service';
import { PaymentDepositController } from './payment-deposit.controller';
import { PaymentDepositClientController } from './payment-deposit.client.controller';
import { PaymentDepositClientService } from './payment-deposit.client.service';
import { MerchantOrderController } from 'src/merchant-order/merchant-order.controller';

@Module({
  controllers: [
    PaymentDepositController,
    PaymentDepositClientController,
    MerchantOrderController,
  ],
  providers: [
    PaymentDepositService,
    PaymentDepositClientService,
    MerchantOrderService,
  ],
})
export class PaymentDepositModule {}
