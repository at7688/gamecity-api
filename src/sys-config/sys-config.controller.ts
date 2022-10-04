import { CronExpression } from '@nestjs/schedule';
import { Body, Controller, Post } from '@nestjs/common';
import { SetVipScheduleDto } from './dto/set-vip-schedule.dto';
import { SysConfigService } from './sys-config.service';
import { SetSmsTemplateDto } from './dto/set-sms-template.dto';

@Controller('system')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Post('vipSchedule')
  setVipSchedule(@Body() data: SetVipScheduleDto) {
    return this.sysConfigService.setVipSchedule(data.cron);
  }

  @Post('smsTemplate')
  setSmsTemplate(@Body() data: SetSmsTemplateDto) {
    return this.sysConfigService.setSmsTemplate(data.content);
  }
}
