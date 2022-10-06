import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { keyBy } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsMerchantService } from 'src/sms-merchant/sms-merchant.service';
import {
  PHONE_CODE_EXPIRED_MINUTES,
  PHONE_CODE_TEMPLATE,
  SITE_NAME,
  SITE_URL,
} from 'src/sys-config/consts';

@Injectable()
export class SmsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsMerchantService: SmsMerchantService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectQueue('phone')
    private readonly phoneCodeQueue: Queue<string>,
  ) {}

  async phoneValidation(phone: string) {
    const configs = await this.prisma.sysConfig.findMany();
    const configMap = keyBy(configs, (t) => t.code);
    const phoneCode = Math.floor(Math.random() * Math.pow(10, 4)).toString();
    await this.cacheManager.set(phone, phoneCode.toString());
    const template = configMap[PHONE_CODE_TEMPLATE].value;
    const siteName = configMap[SITE_NAME].value;
    const siteUrl = configMap[SITE_URL].value;
    const expiredMinutes = +configMap[PHONE_CODE_EXPIRED_MINUTES].value;

    await this.smsMerchantService.sendSms(
      template
        .replace('{siteName}', siteName)
        .replace('{siteUrl}', siteUrl)
        .replace('{code}', phoneCode),
      [phone],
    );

    await this.phoneCodeQueue.add('clearPhoneCode', phone, {
      delay: 1000 * 60 * expiredMinutes,
    });

    return this.prisma.success();
  }
}
