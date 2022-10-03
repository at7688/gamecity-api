import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SmsMerchantService } from './sms-merchant.service';
import { CreateSmsMerchantDto } from './dto/create-sms-merchant.dto';
import { UpdateSmsMerchantDto } from './dto/update-sms-merchant.dto';

@Controller('smsMerchant')
export class SmsMerchantController {
  constructor(private readonly smsMerchantService: SmsMerchantService) {}

  @Post('create')
  create(@Body() createSmsMerchantDto: CreateSmsMerchantDto) {
    return this.smsMerchantService.create(createSmsMerchantDto);
  }

  @Get()
  findAll() {
    return this.smsMerchantService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.smsMerchantService.findOne(code);
  }

  @Post('update')
  update(@Body() updateSmsMerchantDto: UpdateSmsMerchantDto) {
    return this.smsMerchantService.update(updateSmsMerchantDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.smsMerchantService.remove(code);
  }
}
