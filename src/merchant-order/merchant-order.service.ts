import { Injectable, Scope } from '@nestjs/common';
import { MerchantCode } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { QiyuService } from './qiyu.service';

@Injectable({ scope: Scope.REQUEST })
export class MerchantOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qiyu: QiyuService,
  ) {}

  async createOrder(merchant_code: string, record_id: string) {
    switch (merchant_code) {
      case MerchantCode.QIYU:
        return this.qiyu.createOrder(record_id);

      default:
        break;
    }
  }
}
