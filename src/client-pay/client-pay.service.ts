import { MerchantOrderService } from './../merchant-order/merchant-order.service';
import { Inject, Injectable, Scope, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { MerchantCode, Player } from '@prisma/client';
import { getMerchantByPayway } from './raw/getMerchantByPayway';
import CryptoJS from 'crypto-js';
import orderBy from 'lodash/orderBy';
import { CreateOrderDto } from './dto/create-order.dto';
import { getCurrentPayways } from './raw/getCurrentPayways';

@Injectable({ scope: Scope.REQUEST })
export class ClientPayService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly orderService: MerchantOrderService,
    @Inject(REQUEST) private request: Request,
  ) {}
  platform = this.configService.get('PLATFORM');

  get player() {
    return this.request.user as Player;
  }

  async create(data: CreateOrderDto) {
    const { amount, payway_id } = data;

    // const { merchant_id, merchant_code, config, code } = (
    //   await this.prisma.$queryRaw(getMerchantByPayway(payway_id))
    // )[0];

    const d = await this.prisma.paymentTool.findFirst({
      where: {
        payways: { some: { id: payway_id } },
      },
      include: { merchant: true, payways: { where: { id: payway_id } } },
    });

    const payment = d.payways[0];

    const record = await this.prisma.paymentDepositRec.create({
      data: {
        amount,
        player_id: this.player.id,
        payway_id,
        merchant_id: d.merchant_id,
      },
    });

    try {
      switch (d.merchant.code) {
        case MerchantCode.QIYU:
          return await this.orderService.createOrder_QIYU({
            config: d.merchant_config,
            amount,
            payway_code: payment.code,
            player: this.player,
            record,
          });
      }
    } catch (err) {
      throw new BadRequestException('金流支付失敗');
    }
  }

  payways() {
    return this.prisma.$queryRaw(getCurrentPayways(this.player.vip_id));
  }
}
