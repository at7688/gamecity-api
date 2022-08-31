import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { Platforms } from 'src/metas/platforms.meta';
import { CreatePaymentDepositDto } from './dto/create-payment-deposit.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { PaymentDepositClientService } from './payment-deposit.client.service';

@Controller('payment')
@Platforms([PlatformType.PLAYER])
export class PaymentDepositClientController {
  constructor(
    private readonly paymentDepositService: PaymentDepositClientService,
  ) {}

  @Post('deposit')
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
