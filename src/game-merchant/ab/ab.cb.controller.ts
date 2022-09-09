import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { AbCbService } from './ab.cb.service';
import { AbService } from './ab.service';

@Controller('ab/cb')
@Public()
export class AbCbController {
  constructor(private readonly abCbService: AbCbService) {}

  @Get('GetBalance/:username')
  getBalance(@Param('username') username: string, @Headers() headers) {
    return this.abCbService.getBalance(username, headers);
  }

  @Post('Transfer')
  transfer(@Body() body, @Headers() headers) {
    return this.abCbService.transfer(body, headers);
  }
  @Post('CancelTransfer')
  cancelTransfer(@Body() body, @Headers() headers) {
    return this.abCbService.cancelTransfer(body, headers);
  }
}
