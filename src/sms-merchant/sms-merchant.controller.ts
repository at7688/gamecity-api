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
import { Every8dService } from './every8d/every8d.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { GetSmsCreditDto } from './dto/get-sms-credit.dto';

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

  @Post('sendSms')
  sendSms(@Body() data: SendSmsDto) {
    const { content, phones } = data;
    return this.smsMerchantService.sendSms(content, phones);
  }
}
