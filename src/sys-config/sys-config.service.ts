import { CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ADMIN_MULTI_LOGIN,
  AGENT_GIFT_MAX_ROLLING,
  AGENT_MULTI_LOGIN,
  FAILED_LOGIN_LIMIT,
  MAX_LAYER_DEPTH,
  PHONE_CODE_EXPIRED_MINUTES,
  PHONE_CODE_TEMPLATE,
  REGISTER_REQUIRED,
  SMS_MERCHANT,
  VIP_CHECK_SCHEDULE,
} from './consts';
import { SetSysConfigDto } from './dto/set-sys-config.dto';
import { SetVipScheduleDto } from './dto/set-vip-schedule.dto';

@Injectable()
export class SysConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async setSysConfig(data: SetSysConfigDto) {
    const {
      phone_code_template,
      agent_gift_max_rolling,
      agent_multi_login,
      admin_multi_login,
      sms_merchant,
      phone_code_expired_minutes,
      register_required,
      max_layer_depth,
      failed_login_limit,
    } = data;
    await Promise.all([
      this.prisma.sysConfig.update({
        where: {
          code: PHONE_CODE_TEMPLATE,
        },
        data: {
          value: phone_code_template,
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: AGENT_GIFT_MAX_ROLLING,
        },
        data: {
          value: agent_gift_max_rolling.toString(),
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: AGENT_MULTI_LOGIN,
        },
        data: {
          value: agent_multi_login,
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: ADMIN_MULTI_LOGIN,
        },
        data: {
          value: admin_multi_login,
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: SMS_MERCHANT,
        },
        data: {
          value: sms_merchant,
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: PHONE_CODE_EXPIRED_MINUTES,
        },
        data: {
          value: phone_code_expired_minutes.toString(),
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: REGISTER_REQUIRED,
        },
        data: {
          value: register_required.join(','),
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: MAX_LAYER_DEPTH,
        },
        data: {
          value: max_layer_depth.toString(),
        },
      }),
      this.prisma.sysConfig.update({
        where: {
          code: FAILED_LOGIN_LIMIT,
        },
        data: {
          value: failed_login_limit.toString(),
        },
      }),
    ]);

    return this.prisma.success();
  }

  async setVipSchedule(data: SetVipScheduleDto) {
    const { type, day, date, hour, minute } = data;

    await this.prisma.sysConfig.update({
      where: {
        code: VIP_CHECK_SCHEDULE,
      },
      data: {
        value: `${type}.${type === 'month' ? date : day}.${hour}.${minute}`,
      },
    });
    this.eventEmitter.emit('vip.scheduleUpdate', data);
    return this.prisma.success();
  }
}
