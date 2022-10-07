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

  @Post('create')
  create(@Body() createPaymentDepositDto: CreatePaymentDepositDto) {
    return this.paymentDepositService.create(createPaymentDepositDto);
  }

  @Post('list')
  findAll(@Body() search: SearchPaymentDepositsDto) {
    return this.paymentDepositService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentDepositService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentDepositDto: UpdatePaymentDepositDto,
  ) {
    return this.paymentDepositService.update(+id, updatePaymentDepositDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentDepositService.remove(+id);
  }
}
