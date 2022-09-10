import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { BwinCbService } from './bwin.cb.service';
import { BwinBetReq } from './types';

@Controller('bwin/cb')
@Public()
export class BwinCbController {
  constructor(private readonly bwinCbService: BwinCbService) {}

  @Get('validate')
  playerValidate(@Query() query) {
    return this.bwinCbService.playerValidate(query);
  }
  @Get('getBalance')
  getBalance(@Query() query) {
    return this.bwinCbService.getBalance(query);
  }
  @Post('betResult')
  betResult(@Body() body: BwinBetReq) {
    return this.bwinCbService.betResult(body);
  }
  @Post('betting')
  betting(@Body() body: BwinBetReq) {
    return this.bwinCbService.betting(body);
  }
  @Delete('betting')
  cancelBetting(@Body() body: BwinBetReq) {
    return this.bwinCbService.cancelBetting(body);
  }
}
