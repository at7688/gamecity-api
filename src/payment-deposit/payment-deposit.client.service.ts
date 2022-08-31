import { MerchantOrderService } from './../merchant-order/merchant-order.service';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDepositDto } from './dto/create-payment-deposit.dto';
import { UpdatePaymentDepositDto } from './dto/update-payment-deposit.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Player } from '@prisma/client';
import { getMerchantByPayway } from './raw/getMerchantByPayway';
import CryptoJS from 'crypto-js';
import orderBy from 'lodash/orderBy';

@Injectable({ scope: Scope.REQUEST })
export class PaymentDepositClientService {
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

  async create(data: CreatePaymentDepositDto) {
    const { amount, payway_id } = data;

    const { merchant_id, merchant_code, config, pay_code, pay_type } = (
      await this.prisma.$queryRaw(getMerchantByPayway(payway_id))
    )[0];

    const res = await this.prisma.paymentDepositRec.create({
      data: {
        amount,
        player_id: this.player.id,
        payway_id,
        merchant_id,
      },
    });

    switch (merchant_code) {
      case :

        break;

      default:
        break;
    }

    await this.orderService.createOrder_QIYU({
      config,
      order_id: res.id,
      amount,
      pay_code,
    });

    return res;
  }

  findAll() {
    return `This action returns all paymentDeposit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentDeposit`;
  }

  update(id: number, updatePaymentDepositDto: UpdatePaymentDepositDto) {
    return `This action updates a #${id} paymentDeposit`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentDeposit`;
  }
}
