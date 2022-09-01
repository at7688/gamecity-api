import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MerchantCode, Player } from '@prisma/client';
import { add } from 'date-fns';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { MerchantOrderService } from './../merchant-order/merchant-order.service';
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

    // 確認支付工具是否已經到達儲值上限
    if (d.recharge_max) {
      //
    }
    // 確認儲值金額是否符合支付方式的單筆儲值條件
    if (amount > payment.deposit_max) {
      throw new BadRequestException(`超過單筆儲值上限${payment.deposit_max}`);
    }
    if (amount < payment.deposit_min) {
      throw new BadRequestException(`最低儲值金額為${payment.deposit_min}`);
    }
    // 計算手續費負擔
    let fee = 0;
    let fee_on_player = 0;
    fee += payment.fee_amount += amount * payment.fee_percent;
    fee_on_player += payment.player_fee_amount +=
      amount * payment.player_fee_percent;

    // 手續費若超過限額，則吃限額數值
    if (fee > payment.fee_max) {
      fee = payment.fee_max;
    }
    if (fee < payment.fee_min) {
      fee = payment.fee_min;
    }
    if (fee_on_player > payment.player_fee_max) {
      fee_on_player = payment.player_fee_max;
    }
    if (fee_on_player < payment.player_fee_min) {
      fee_on_player = payment.player_fee_min;
    }

    const record = await this.prisma.paymentDepositRec.create({
      data: {
        amount,
        player_id: this.player.id,
        payway_id,
        merchant_id: d.merchant_id,
        fee,
        fee_on_player,
        expired_at: add(new Date(), { days: 1 }), // 預設截止時間為1天
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
    console.log(this.request.protocol);
    console.log(this.request.hostname);
    console.log(this.request.path);
    console.log(this.request.url);
    return this.prisma.$queryRaw(getCurrentPayways(this.player.vip_id));
  }
}
