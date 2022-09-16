import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { OgCbService } from './og.cb.service';
import { OgService } from './og.service';
import { OgGetBalanceReq } from './types/getBalance';
import { OgValidationReq } from './types/validation';

@Controller('og/cb')
@Public()
export class OgCbController {
  constructor(private readonly ogCbService: OgCbService) {}

  @Post('/api/v1/operator/security/authenticate')
  @HttpCode(200)
  validation(@Body() body: OgValidationReq, @Headers() headers) {
    return this.ogCbService.authenticate(body, headers);
  }
  // /og/cb/api/v1/operator/transaction/bulk/debit
  @Post('/api/v1/operator/transaction/bulk/debit')
  @HttpCode(200)
  betting(@Body() body, @Headers() headers) {
    console.log(body);
    return this.ogCbService.betting(body, headers);
  }
  @Post('/api/v1/operator/transaction/credit')
  @HttpCode(200)
  betResult(@Body() body, @Headers() headers) {
    console.log(body);
    return this.ogCbService.betResult(body, headers);
  }

  @Get('/api/v1/operator/player/balance')
  balance(@Query() query: OgGetBalanceReq, @Headers() headers) {
    return this.ogCbService.getBalance(query, headers);
  }
}
