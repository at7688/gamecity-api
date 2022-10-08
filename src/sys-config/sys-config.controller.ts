import { CronExpression } from '@nestjs/schedule';
import { Body, Controller, Post } from '@nestjs/common';
import { SysConfigService } from './sys-config.service';
import { SetSysConfigDto } from './dto/set-sys-config.dto';
import { SetVipScheduleDto } from './dto/set-vip-schedule.dto';

@Controller('system')
export class SysConfigController {
  constructor(private readonly sysConfigService: SysConfigService) {}

  @Post('setting')
  setSysConfig(@Body() data: SetSysConfigDto) {
    return this.sysConfigService.setSysConfig(data);
  }

  @Post('vipSchedule')
  setVipSchedule(@Body() data: SetVipScheduleDto) {
    return this.sysConfigService.setVipSchedule(data);
  }
}
