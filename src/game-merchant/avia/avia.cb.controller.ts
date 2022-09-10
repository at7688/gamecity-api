import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { AviaCbService } from './avia.cb.service';
import { AviaService } from './avia.service';
import { AviaActionType, AviaCbReq, AviaCbRes } from './types';

@Controller('avia/cb')
@Public()
export class AviaCbController {
  constructor(private readonly aviaCbService: AviaCbService) {}

  @Post()
  callback(@Body() body: AviaCbReq, @Headers() headers) {
    switch (body.Action) {
      case AviaActionType.GET_BALANCE:
        return this.aviaCbService.getBalance(body, headers);
      case AviaActionType.TRANSFER:
        return this.aviaCbService.transfer(body, headers);
      case AviaActionType.TRADE_CHECK:
      // return this.aviaService.transfer(body, headers);
    }
  }
}
