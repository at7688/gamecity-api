import { Module } from '@nestjs/common';
import { MerchantOrderModule } from 'src/merchant-order/merchant-order.module';
import { ClientPayController } from './client-pay.controller';
import { ClientPayService } from './client-pay.service';

@Module({
  imports: [MerchantOrderModule],
  controllers: [ClientPayController],
  providers: [ClientPayService],
})
export class ClientPayModule {}
