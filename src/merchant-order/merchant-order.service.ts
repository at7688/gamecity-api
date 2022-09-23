import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MerchantCode } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecService } from './../wallet-rec/wallet-rec.service';
import { QiyuService } from './qiyu.service';

@Injectable({ scope: Scope.REQUEST })
export class MerchantOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qiyu: QiyuService,
    @Inject(REQUEST) private request: Request,
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
