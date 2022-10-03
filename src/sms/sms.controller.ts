import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/metas/public.meta';
import { GetPhoneCodeDto } from './dto/get-phone-code.dto';
import { SmsService } from './sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('validation')
  @Public()
  phoneValidation(@Body() data: GetPhoneCodeDto) {
    return this.smsService.phoneValidation(data.phone);
  }
}
