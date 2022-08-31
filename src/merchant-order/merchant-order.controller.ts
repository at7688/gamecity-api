import { Body, Controller, Post } from '@nestjs/common';
import { PaymentDepositService } from 'src/payment-deposit/payment-deposit.service';

@Controller('order')
export class MerchantOrderController {
  constructor(private readonly paymentDepositService: PaymentDepositService) {}

  @Post('qiyu/:order_id')
  notify_QIYU(@Body() body) {
    return;
  }
}
