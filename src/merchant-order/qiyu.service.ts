import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { MerchantCode, Prisma } from '@prisma/client';
import axios from 'axios';
import { MD5 } from 'crypto-js';
import { getUnixTime } from 'date-fns';
import { Request } from 'express';
import { orderBy } from 'lodash';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { MerchantOrderService } from './merchant-order.service';
import { OrderResponseService } from './order-response.service';
import { QIYU_CreateOrder, QIYU_Notify, QIYU_OrderRes } from './types/qiyu';

@Injectable({ scope: Scope.REQUEST })
export class QiyuService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly orderResponseService: OrderResponseService,
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

    // 廠商回傳錯誤代碼
    if (data.status !== '30000') {
      await this.orderResponseService.orderFailed(data.order_id, data);
      return 'OK';
    }

    const record = await this.prisma.paymentDepositRec.findUnique({
      where: { id: data.order_id },
    });

    // 簽名不對或金額不對則返回錯誤
    if (valid_sign !== sign || data.real_amount !== record.amount) {
      await this.orderResponseService.orderFailed(data.order_id, data);
      return 'ERROR';
    }

    await this.orderResponseService.orderSuccess(data.order_id);

    return 'OK';
  }
}
