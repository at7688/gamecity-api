import { Module } from '@nestjs/common';
import { PaymentDepositModule } from 'src/payment-deposit/payment-deposit.module';
import { MerchantOrderController } from './merchant-order.controller';
import { MerchantOrderService } from './merchant-order.service';

@Module({
  imports: [PaymentDepositModule],
  controllers: [MerchantOrderController],
  providers: [MerchantOrderService],
  exports: [MerchantOrderService],
})
export class MerchantOrderModule {}
