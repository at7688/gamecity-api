import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentToolService } from './payment-tool.service';
import { CreatePaymentToolDto } from './dto/create-payment-tool.dto';
import { UpdatePaymentToolDto } from './dto/update-payment-tool.dto';

@Controller('payment-tools')
export class PaymentToolController {
  constructor(private readonly paymentToolService: PaymentToolService) {}

  @Post()
  create(@Body() createPaymentToolDto: CreatePaymentToolDto) {
    return this.paymentToolService.create(createPaymentToolDto);
  }

  @Get()
  findAll() {
    return this.paymentToolService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentToolService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentToolDto: UpdatePaymentToolDto,
  ) {
    return this.paymentToolService.update(id, updatePaymentToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentToolService.remove(id);
  }
}
