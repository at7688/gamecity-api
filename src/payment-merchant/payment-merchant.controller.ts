import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentMerchantService } from './payment-merchant.service';
import { CreatePaymentMerchantDto } from './dto/create-payment-merchant.dto';
import { UpdatePaymentMerchantDto } from './dto/update-payment-merchant.dto';

@Controller('paymentMerchant')
export class PaymentMerchantController {
  constructor(
    private readonly paymentMerchantService: PaymentMerchantService,
  ) {}

  @Post()
  create(@Body() createPaymentMerchantDto: CreatePaymentMerchantDto) {
    return this.paymentMerchantService.create(createPaymentMerchantDto);
  }

  @Get('list')
  findAll() {
    return this.paymentMerchantService.findAll();
  }

  // @Get('options')
  // options() {
  //   return this.paymentMerchantService.options();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentMerchantService.findOne(id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentMerchantDto: UpdatePaymentMerchantDto,
  ) {
    return this.paymentMerchantService.update(id, updatePaymentMerchantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMerchantService.remove(id);
  }
}
