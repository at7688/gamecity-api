import { CreateOrderDto } from './dto/create-order.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientPayService } from './client-pay.service';
import { Platforms } from 'src/metas/platforms.meta';
import { PlatformType } from '@prisma/client';
import { Public } from 'src/metas/public.meta';

@Controller('client-pay')
@Platforms([PlatformType.PLAYER])
export class ClientPayController {
  constructor(private readonly clientPayService: ClientPayService) {}

  @Get('payways')
  payways() {
    return this.clientPayService.payways();
  }

  @Post('create')
  create(@Body() createPaymentDepositDto: CreateOrderDto) {
    return this.clientPayService.create(createPaymentDepositDto);
  }
}
