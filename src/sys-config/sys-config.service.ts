import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { PHONE_CODE_TEMPLATE, VIP_CHECK_SCHEDULE } from './consts';

@Injectable()
export class SysConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async setVipSchedule(cron: string) {
    await this.prisma.sysConfig.update({
      where: {
        code: VIP_CHECK_SCHEDULE,
      },
      data: {
        value: cron,
      },
    });
    this.eventEmitter.emit('vip.schedule', cron);
  }

  async setSmsTemplate(content: string) {
    await this.prisma.sysConfig.update({
      where: {
        code: PHONE_CODE_TEMPLATE,
      },
      data: {
        value: content,
      },
    });
  }
}
