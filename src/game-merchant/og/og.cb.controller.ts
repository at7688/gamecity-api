import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { OgCbService } from './og.cb.service';
import { OgService } from './og.service';
import { OgValidationReq } from './types/validation';

@Controller('og/cb')
@Public()
export class OgCbController {
  constructor(private readonly ogCbService: OgCbService) {}

  @Post('/api/v1/operator/security/authenticate')
  validation(@Body() body: OgValidationReq) {
    const res = {
      player_status: 'activate',
      rs_code: 'S-100',
      rs_message: 'success',
      token: body.token,
    };
    console.log(body);
    return res;
  }
  @Get('GetBalance/:username')
  getBalance(@Param('username') username: string, @Headers() headers) {
    return this.ogCbService.getBalance(username, headers);
  }

  @Get('/api/v1/operator/player/balance')
  balance(@Query() query, @Body() body, @Headers() headers) {
    console.log(query);
    console.log(body);
    return this.ogCbService.getBalance(body, headers);
  }
  @Post('CancelTransfer')
  cancelTransfer(@Body() body, @Headers() headers) {
    return this.ogCbService.cancelTransfer(body, headers);
  }
}
