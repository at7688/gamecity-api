import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSmsMerchantDto } from './dto/create-sms-merchant.dto';
import { GetSmsCreditDto } from './dto/get-sms-credit.dto';
import { UpdateSmsMerchantDto } from './dto/update-sms-merchant.dto';
import { Every8dService } from './every8d/every8d.service';
import { SmsMerchantService } from './sms-merchant.service';

@Controller('smsMerchant')
export class SmsMerchantController {
  constructor(
    private readonly smsMerchantService: SmsMerchantService,
    private readonly every8dService: Every8dService,
  ) {}

  @Post('create')
  create(@Body() createSmsMerchantDto: CreateSmsMerchantDto) {
    return this.smsMerchantService.create(createSmsMerchantDto);
  }

  @Get()
  findAll() {
    return this.smsMerchantService.findAll();
  }

  // @Get(':code')
  // findOne(@Param('code') code: string) {
  //   return this.smsMerchantService.findOne(code);
  // }

  @Post('update')
  update(@Body() updateSmsMerchantDto: UpdateSmsMerchantDto) {
    return this.smsMerchantService.update(updateSmsMerchantDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.smsMerchantService.remove(code);
  }

  @Get('getCredit')
  getCredit(@Body() data: GetSmsCreditDto) {
    return this.smsMerchantService.getCredit(data.merchant_code);
  }
}
