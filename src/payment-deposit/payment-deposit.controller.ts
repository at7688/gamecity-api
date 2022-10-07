import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentDepositService } from './payment-deposit.service';
import { CreatePaymentDepositDto } from './dto/create-payment-deposit.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { SearchPaymentDepositsDto } from './dto/search-payment-deposits.dto';

@Controller('payment-deposit')
export class PaymentDepositController {
  constructor(private readonly paymentDepositService: PaymentDepositService) {}

  @Post('list')
  findAll(@Body() search: SearchPaymentDepositsDto) {
    return this.paymentDepositService.findAll(search);
  }
}
