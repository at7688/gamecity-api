import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { AviaService } from './avia.service';
import { AviaActionType, AviaCbReq, AviaCbRes } from './types';

@Controller('avia/cb')
@Public()
export class AviaCbController {
  constructor(private readonly aviaService: AviaService) {}

  @Post()
  callback(@Body() body: AviaCbReq, @Headers() headers) {
    switch (body.Action) {
      case AviaActionType.GET_BALANCE:
        return this.aviaService.getBalance(body, headers);
      case AviaActionType.TRANSFER:
        return this.aviaService.transfer(body, headers);
      case AviaActionType.TRADE_CHECK:
      // return this.aviaService.transfer(body, headers);
    }
  }
}
