import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentToolService } from './payment-tool.service';
import { CreatePaymentToolDto } from './dto/create-payment-tool.dto';
import { UpdatePaymentToolDto } from './dto/update-payment-tool.dto';
import { SearchPaymentToolsDto } from './dto/search-payment-tools.dto';
import { ActivePaymentToolDto } from './dto/active-payment-tool.dto';

@Controller('payment-tools')
export class PaymentToolController {
  constructor(private readonly paymentToolService: PaymentToolService) {}

  @Post()
  create(@Body() createPaymentToolDto: CreatePaymentToolDto) {
    return this.paymentToolService.create(createPaymentToolDto);
  }

  @Get()
  findAll(@Query() query: SearchPaymentToolsDto) {
    return this.paymentToolService.findAll(query);
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
