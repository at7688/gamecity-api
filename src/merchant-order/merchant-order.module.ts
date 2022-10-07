import { WalletRecModule } from './../wallet-rec/wallet-rec.module';
import { Module } from '@nestjs/common';
import { PaymentDepositModule } from 'src/payment-deposit/payment-deposit.module';
import { MerchantOrderController } from './merchant-order.controller';
import { MerchantOrderService } from './merchant-order.service';
import { QiyuService } from './qiyu.service';
import { OrderResponseService } from './order-response.service';

@Module({
  imports: [PaymentDepositModule, WalletRecModule],
  controllers: [MerchantOrderController],
  providers: [MerchantOrderService, QiyuService, OrderResponseService],
  exports: [MerchantOrderService],
})
export class MerchantOrderModule {}
