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

@Controller('payment-deposits')
export class PaymentDepositController {
  constructor(private readonly paymentDepositService: PaymentDepositService) {}

  @Post()
  create(@Body() createPaymentDepositDto: CreatePaymentDepositDto) {
    return this.paymentDepositService.create(createPaymentDepositDto);
  }

  @Get()
  findAll() {
    return this.paymentDepositService.findAll();
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
