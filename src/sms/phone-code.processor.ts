import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { SmsMerchantService } from 'src/sms-merchant/sms-merchant.service';

@Processor('phone')
export class PhoneCodeProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smsMerchantService: SmsMerchantService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @InjectQueue('phone')
    private readonly phoneCodeQueue: Queue<string>,
  ) {}

  @Process('clearPhoneCode')
  async phoneValidation(job: Job<string>) {
    await this.cacheManager.del(job.data);
  }
}
