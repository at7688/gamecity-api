import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { SearchPromoCode } from './dto/search-promo-code.dto';
import { LoginUser } from 'src/types';
import { User } from 'src/decorators/user.decorator';
import { Request } from 'express';
import { Public } from 'src/metas/public.meta';

@Controller('promoCode')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @Post('visit/:code')
  @Public()
  visit(@Param('code') code: string, @Req() req: Request) {
    console.log(req.ip);
    return this.promoCodeService.visit(code, req.ip);
  }

  @Post('validate/:code')
  validate(@Param('code') code: string) {
    return this.promoCodeService.validate(code);
  }
  @Post('create')
  create(@Body() createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodeService.create(createPromoCodeDto);
  }

  @Post('list')
  findAll(@Body() search: SearchPromoCode, @User() user: LoginUser) {
    console.log(search);
    if ('admin_role_id' in user) {
      return this.promoCodeService.findAll(search);
    }
    return this.promoCodeService.findAll(search, user);
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.promoCodeService.findOne(code);
  }

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() updatePromoCodeDto: UpdatePromoCodeDto,
  ) {
    return this.promoCodeService.update(code, updatePromoCodeDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.promoCodeService.remove(code);
  }
}
