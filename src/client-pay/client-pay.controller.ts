import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientPayService } from './client-pay.service';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';
import { Public } from 'src/metas/public.meta';
import { CreateBankOrderDto } from './dto/create-bank-order.dto';

@Controller('client-pay')
@Platforms([PlatformType.PLAYER])
export class ClientPayController {
  constructor(private readonly clientPayService: ClientPayService) {}

  @Get('payways')
  payways() {
    return this.clientPayService.payways();
  }

  @Get('bankcards')
  bankcards() {
    return this.clientPayService.bankcards();
  }

  @Post('order/payment')
  createPaymentOrder(@Body() data: CreatePaymentOrderDto) {
    return this.clientPayService.createPaymentOrder(data);
  }
  @Post('order/bank')
  createBankOrder(@Body() data: CreateBankOrderDto) {
    return this.clientPayService.createBankOrder(data);
  }
}
