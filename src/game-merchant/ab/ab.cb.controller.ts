import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { AbService } from './ab.service';

@Controller('ab/cb')
@Public()
export class AbCbController {
  constructor(private readonly abService: AbService) {}

  @Get('GetBalance/:username')
  getBalance(@Param('username') username: string, @Headers() headers) {
    return this.abService.getBalance(username, headers);
  }

  @Post('Transfer')
  transfer(@Body() body, @Headers() headers) {
    return this.abService.transfer(body, headers);
  }
  @Post('CancelTransfer')
  cancelTransfer(@Body() body, @Headers() headers) {
    return this.abService.cancelTransfer(body, headers);
  }
}
