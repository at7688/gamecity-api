import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MerchantCode, Player } from '@prisma/client';
import { add } from 'date-fns';
import { Request } from 'express';
import { CardInfo, getCurrentCard } from './raw/getCurrentCard';
import { ValidStatus } from 'src/p-bankcard/enums';
import { ValidTool, validTools } from 'src/payment-tool/raw/validTools';
import { PrismaService } from 'src/prisma/prisma.service';
import { MerchantOrderService } from './../merchant-order/merchant-order.service';
import { CreatePaymentOrderDto } from './dto/create-payment-order.dto';
import { getCurrentPayways } from './raw/getCurrentPayways';
import { CreateBankOrderDto } from './dto/create-bank-order.dto';

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

  bankcards() {
    return this.prisma.playerCard.findMany({
      where: {
        player_id: this.player.id,
      },
    });
  }

  async createBankOrder(data: CreateBankOrderDto) {
    const { amount, player_card_id } = data;

    // 驗證客戶的卡片
    const playerCard = await this.prisma.playerCard.findFirst({
      where: {
        id: player_card_id,
        player_id: this.player.id,
        valid_status: ValidStatus.VALID,
      },
    });
    if (!playerCard) {
      throw new BadRequestException('卡片不可用');
    }

    // 取得當前輪替的卡片們
    const cards = await this.prisma.$queryRaw<CardInfo[]>(
      getCurrentCard(this.player.id),
    );

    // 若無限額內可用卡片則提示錯誤
    if (cards.length === 0) {
      throw new BadRequestException('暫無提供儲值，請聯繫客服');
    }

    // 取得當前運作的卡片
    let card = cards.find((t) => t.is_current);

    // 若無當前運作中卡片則開啟限額內的備用卡片
    if (!card) {
      card = cards[0];
      await this.prisma.companyCard.update({
        where: { id: card.card_id },
        data: { is_current: true },
      });
    }

    // 若儲值後超出限額，則關閉當前卡片
    if (amount + card.current_sum > card.deposit_max) {
      await this.prisma.companyCard.update({
        where: { id: card.card_id },
        data: { is_current: false },
      });
    }

    //  新增儲值
    return this.prisma.bankDepositRec.create({
      select: {
        id: true,
        amount: true,
        created_at: true,
      },
      data: {
        amount,
        card_id: card.card_id,
        player_id: this.player.id,
        player_card_id,
      },
    });
  }

  async createPaymentOrder(data: CreatePaymentOrderDto) {
    const { amount, payway_id } = data;

    const vip = await this.prisma.vip.findUnique({
      where: { id: this.player.vip_id },
    });

    // 列出該玩家VIP等級輪替群組內可使用的支付工具
    const tools = await this.prisma.$queryRaw<ValidTool[]>(
      validTools({ rotation_id: vip.payment_rotate_id }),
    );

    if (tools.length === 0) {
      throw new BadRequestException('無可用支付');
    }

    let currentTool = tools.find((t) => t.is_current);

    // 若無當前輪替，則使用備用工具
    if (!currentTool) {
      await this.prisma.$transaction([
        this.prisma.paymentTool.updateMany({
          where: { rotation_id: vip.payment_rotate_id },
          data: { is_current: false },
        }),
        this.prisma.paymentTool.update({
          where: { id: tools[0].id },
          data: { is_current: true },
        }),
      ]);
      currentTool = tools[0];
    }

    const payway = await this.prisma.payway.findFirst({
      where: { id: payway_id, tool_id: currentTool.id, is_active: true },
    });

    // 若該輪替工具下無該付款方式，則提示
    if (!payway) {
      throw new BadRequestException('無此付款方式，請重新選擇');
    }

    // 確認儲值金額是否符合支付方式的單筆儲值條件
    if (amount > payway.deposit_max) {
      throw new BadRequestException(`超過單筆儲值上限${payway.deposit_max}`);
    }
    if (amount < payway.deposit_min) {
      throw new BadRequestException(`最低儲值金額為${payway.deposit_min}`);
    }
    // 計算手續費負擔
    let fee = 0;
    let fee_on_player = 0;
    fee += payway.fee_amount += amount * payway.fee_percent;
    fee_on_player += payway.player_fee_amount +=
      amount * payway.player_fee_percent;

    // 手續費若超過限額，則吃限額數值
    if (fee > payway.fee_max) {
      fee = payway.fee_max;
    }
    if (fee < payway.fee_min) {
      fee = payway.fee_min;
    }
    if (fee_on_player > payway.player_fee_max) {
      fee_on_player = payway.player_fee_max;
    }
    if (fee_on_player < payway.player_fee_min) {
      fee_on_player = payway.player_fee_min;
    }

    const record = await this.prisma.paymentDepositRec.create({
      data: {
        amount,
        player_id: this.player.id,
        payway_id,
        merchant_id: currentTool.merchant_id,
        fee,
        fee_on_player,
        expired_at: add(new Date(), { days: 1 }), // 預設截止時間為1天
      },
    });

    // 若儲值總量已過上限則關閉此通道
    if (currentTool.recharge_max <= currentTool.current_amount + amount) {
      this.prisma.paymentTool.update({
        where: { id: currentTool.id },
        data: { is_current: false },
      });
    }

    try {
      switch (currentTool.merchant_code) {
        case MerchantCode.QIYU:
          return await this.orderService.createOrder_QIYU({
            config: currentTool.merchant_config,
            amount,
            payway_code: payway.code,
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
