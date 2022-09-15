import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { OgCbService } from './og.cb.service';
import { OgService } from './og.service';

@Controller('og/cb')
@Public()
export class OgCbController {
  constructor(private readonly ogCbService: OgCbService) {}

  @Get('/api/v1/operator/security/authenticate')
  validation(@Param('username') username: string, @Headers() headers) {
    return {
      rs_code: 'S-100',
      rs_message: 'success',
    };
  }
  @Get('GetBalance/:username')
  getBalance(@Param('username') username: string, @Headers() headers) {
    return this.ogCbService.getBalance(username, headers);
  }

  @Post('Transfer')
  transfer(@Body() body, @Headers() headers) {
    return this.ogCbService.transfer(body, headers);
  }
  @Post('CancelTransfer')
  cancelTransfer(@Body() body, @Headers() headers) {
    return this.ogCbService.cancelTransfer(body, headers);
  }
}
