import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { AbService } from './ab.service';

@Controller('ab/cb')
@Public()
export class AbCbController {
  constructor(private readonly abService: AbService) {}

  @Get('GetBalance/:username')
  getBalance(@Param('username') username: string, @Headers() headers) {
    console.log(headers);
    return this.abService.getBalance(username, headers);
  }

  @Post('Transfer')
  Transfer(@Body() body, @Headers() headers) {
    console.log(headers);
    return this.abService.transfer(body, headers);
  }
}
