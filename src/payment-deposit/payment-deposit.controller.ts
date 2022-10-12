import { Body, Controller, Post } from '@nestjs/common';
import { SearchPaymentDepositsDto } from './dto/search-payment-deposits.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { PaymentDepositService } from './payment-deposit.service';

@Controller('paymentDeposit')
export class PaymentDepositController {
  constructor(private readonly paymentDepositService: PaymentDepositService) {}

  @Post('list')
  findAll(@Body() search: SearchPaymentDepositsDto) {
    return this.paymentDepositService.findAll(search);
  }

  @Post('update')
  validate(@Body() data: UpdatePaymentDepositDto) {
    return this.paymentDepositService.update(data);
  }
}
