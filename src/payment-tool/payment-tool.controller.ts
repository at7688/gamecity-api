import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivePaymentToolDto } from './dto/active-payment-tool.dto';
import { CreatePaymentToolDto } from './dto/create-payment-tool.dto';
import { SearchPaymentToolsDto } from './dto/search-payment-tools.dto';
import { UpdatePaymentToolDto } from './dto/update-payment-tool.dto';
import { PaymentToolService } from './payment-tool.service';

@Controller('payment')
export class PaymentToolController {
  constructor(private readonly paymentToolService: PaymentToolService) {}

  @Post('create')
  create(@Body() createPaymentToolDto: CreatePaymentToolDto) {
    return this.paymentToolService.create(createPaymentToolDto);
  }

  @Post('list')
  findAll(@Body() search: SearchPaymentToolsDto) {
    return this.paymentToolService.findAll(search);
  }

  @Post('clean/:id')
  clean(@Param('id') id: string) {
    return this.paymentToolService.clean(id);
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

  @Patch(':id/current')
  current(@Param('id') id: string) {
    return this.paymentToolService.current(id);
  }

  @Patch(':id/active')
  active(@Param('id') id: string, @Body() data: ActivePaymentToolDto) {
    return this.paymentToolService.active(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentToolService.remove(id);
  }
}
