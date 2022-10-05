import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MerchantCode, Prisma } from '@prisma/client';
import axios from 'axios';
import { MD5 } from 'crypto-js';
import { getUnixTime } from 'date-fns';
import { Request } from 'express';
import { orderBy } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { PlayerTagType } from 'src/player/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRecType } from 'src/wallet-rec/enums';
import { WalletRecService } from '../wallet-rec/wallet-rec.service';
import { MerchantOrderStatus } from './enums';
import { QIYU_CreateOrder, QIYU_Notify, QIYU_OrderRes } from './types/qiyu';

@Injectable({ scope: Scope.REQUEST })
export class QiyuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly walletRecService: WalletRecService,
    @Inject(REQUEST) private request: Request,
  ) {}

  mercantCode = 'QIYU';
  apiUrl = 'https://qiyu588.com/pay/pay_order';

  getSign(request: object, hash_key: string) {
    let query = '';
    orderBy(Object.keys(request), (t) => t).forEach((key) => {
      query += `${key}=${request[key]}&`;
    });

    return MD5(`${query}key=${hash_key}`).toString().toUpperCase();
  }

  async createOrder(record_id: string) {
    const record = await this.prisma.paymentDepositRec.findUnique({
      where: { id: record_id },
      include: {
        player: {
          select: {
            username: true,
          },
        },
        payway: {
          include: {
            tool: {
              select: {
                merchant_config: true,
              },
            },
          },
        },
      },
    });
    const { merchant_no, hash_key } = record.payway.tool.merchant_config as any;

    const request: QIYU_CreateOrder = {
      pay_customer_id: merchant_no,
      pay_apply_date: getUnixTime(new Date()),
      pay_order_id: record.id,
      pay_channel_id: +record.payway.code,
      pay_notify_url: `${
        this.configService.get('RETURN_BASE_URL') ||
        `${this.request.protocol}://${this.request.headers.host}`
      }/order/notify/${this.mercantCode}`,
      pay_amount: record.amount,
      user_name: record.player.username,
    };

    request.pay_md5_sign = this.getSign(request, hash_key);

    const res = await axios.post<QIYU_OrderRes>(this.apiUrl, request);
    if (res.data.code !== 0) {
      this.prisma.error(ResCode.PAYMENT_MERCHANT_ERR, '金流交易錯誤');
    }
    const d = res.data.data;

    if (d.real_price !== d.bill_price) {
      this.prisma.error(ResCode.PAYMENT_MERCHANT_ERR, '訂單金額不符合');
    }

    const order = await this.prisma.paymentDepositRec.update({
      where: { id: d.order_id },
      data: {
        trans_id: d.transaction_id,
        expired_at: new Date(d.expired),
        merchant_id: record.merchant_id,
        pay_code: d.bank_owner === 'CVS' ? d.bank_no : null,
        bank_code: d.bank_owner === 'ATM' ? d.bank_from : null,
        bank_account: d.bank_owner === 'ATM' ? d.bank_no : null,
        order_info: d as unknown as Prisma.InputJsonObject,
      },
      include: {
        payway: true,
      },
    });

    return order;
  }

  async notify(data: QIYU_Notify) {
    try {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: MerchantCode.QIYU,
          sendData: data as unknown as Prisma.InputJsonValue,
        },
      });

      const paymentTool = await this.prisma.paymentTool.findFirst({
        where: {
          payways: {
            some: {
              records: {
                some: {
                  id: data.order_id,
                },
              },
            },
          },
        },
      });
      const config = paymentTool.merchant_config as any;

      console.log(config);

      const valid_sign = data.sign;
      delete data.extra;
      delete data.sign;
      const sign = this.getSign(data, config?.hash_key);

      // 驗證簽名正確性
      // if (data.status !== '30000' || valid_sign !== sign) {
      //   return 'ERROR';
      // }

      const record = await this.prisma.paymentDepositRec.findUnique({
        where: { id: data.order_id },
        include: { merchant: true, payway: true, player: true },
      });

      if (data.status !== '30000') {
        await this.prisma.paymentDepositRec.update({
          where: { id: data.order_id },
          data: {
            canceled_at: new Date(),
            finished_at: new Date(),
            status: MerchantOrderStatus.REJECTED,
            notify_info: data as unknown as Prisma.InputJsonObject,
          },
        });
        return 'OK';
      }

      // 查看是否有儲值紀錄
      const rechargedTag = await this.prisma.playerTag.findFirst({
        where: { player_id: record.player.id, type: PlayerTagType.RECHARGED },
      });

      if (!rechargedTag) {
        // 無儲值紀錄則將玩家打上儲值紀錄
        await this.prisma.playerTag.create({
          data: {
            player_id: record.player.id,
            type: PlayerTagType.RECHARGED,
          },
        });
      }

      await this.prisma.$transaction([
        this.prisma.paymentDepositRec.update({
          where: { id: data.order_id },
          data: {
            paid_at: new Date(),
            finished_at: new Date(),
            status: MerchantOrderStatus.PAID,
            notify_info: data as unknown as Prisma.InputJsonObject,
            is_first: !rechargedTag, // 無儲值紀錄則將此單標記為首儲
          },
        }),
        ...(await this.walletRecService.playerCreate({
          type: WalletRecType.PAYMENT_DEPOSIT,
          player_id: record.player_id,
          amount: record.amount,
          fee: record.fee_on_player,
          source: `${record.merchant.name}(${record.merchant.code})/${record.payway.name}(${record.payway.code})`,
          relative_id: record.id,
        })),
      ]);
      return 'OK';
    } catch (err) {
      console.log(err);
      this.prisma.error(ResCode.PAYMENT_MERCHANT_ERR);
    }
  }
}
