import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaywayService } from './payway.service';
import { CreatePaywayDto } from './dto/create-payway.dto';
import { UpdatePaywayDto } from './dto/update-payway.dto';

@Controller('payway')
export class PaywayController {
  constructor(private readonly paywayService: PaywayService) {}

  @Post('create')
  create(@Body() createPaywayDto: CreatePaywayDto) {
    return this.paywayService.create(createPaywayDto);
  }

  @Get()
  findAll() {
    return this.paywayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paywayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaywayDto: UpdatePaywayDto) {
    return this.paywayService.update(+id, updatePaywayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paywayService.remove(+id);
  }
}
