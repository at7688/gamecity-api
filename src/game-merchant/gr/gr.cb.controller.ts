import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { GrCbService } from './gr.cb.service';
import { GrService } from './gr.service';
import { GrActionType, GrCbReq, GrCbRes } from './types';

@Controller('gr/cb')
@Public()
export class GrCbController {
  constructor(private readonly grCbService: GrCbService) {}

  @Post()
  callback(@Body() body: GrCbReq) {
    switch (body.Action) {
      case GrActionType.GET_BALANCE:
        return this.grCbService.getBalance(body);
      case GrActionType.TRANSFER:
        return this.grCbService.transfer(body);
      case GrActionType.TRADE_CHECK:
        return this.grCbService.tradeCheck(body);
    }
  }
}
