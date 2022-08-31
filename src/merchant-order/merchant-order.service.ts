import { getMerchantConfigByRecord } from './raw/getMerchantConfigByRecord';
import { MD5 } from 'crypto-js';
import { orderBy } from 'lodash';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUnixTime } from 'date-fns';
import axios from 'axios';
import {
  PaymentDepositRec,
  Prisma,
  MerchantCode,
  Player,
} from '@prisma/client';

interface OrderInfo {
  config: any;
  amount: number;
  payway_code: string;
  player: Player;
  record: PaymentDepositRec;
}
@Injectable()
export class MerchantOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async merchantHub() {
    return;
  }

  getSign_QIYU(request: object, hash_key: string) {
    let query = '';
    orderBy(Object.keys(request), (t) => t).forEach((key) => {
      query += `${key}=${request[key]}&`;
    });

    return MD5(`${query}key=${hash_key}`).toString().toUpperCase();
  }

  async createOrder_QIYU({
    config,
    amount,
    payway_code,
    player,
    record,
  }: OrderInfo) {
    const { merchant_no, hash_key } = config;
    interface QIYU_CreateOrder {
      pay_customer_id: string;
      pay_apply_date: number;
      pay_order_id: string;
      pay_channel_id: number;
      pay_notify_url: string;
      pay_amount: number;
      user_name: string;
      pay_md5_sign?: string;
    }
    const request: QIYU_CreateOrder = {
      pay_customer_id: merchant_no,
      pay_apply_date: getUnixTime(new Date()),
      pay_order_id: record.id,
      pay_channel_id: +payway_code,
      pay_notify_url:
        'https://2940-61-222-155-67.jp.ngrok.io/order/notify/QIYU',
      pay_amount: amount,
      user_name: player.username,
    };

    request.pay_md5_sign = this.getSign_QIYU(request, hash_key);

    interface QIYU_OrderRes {
      code: number;
      message: string;
      data: {
        order_id: string;
        transaction_id: string;
        view_url: string;
        qr_url: string;
        expired: Date;
        user_name: string;
        bill_price: number;
        real_price: number;
        bank_no: string;
        bank_name: string;
        bank_from: string;
        bank_owner: string;
      };
    }

    const res = await axios.post<QIYU_OrderRes>(
      'https://qiyu588.com/pay/pay_order',
      request,
    );
    if (res.data.code !== 0) {
      console.log(res.data);
      throw new BadGatewayException('金流交易錯誤');
    }
    const d = res.data.data;

    if (d.real_price !== d.bill_price) {
      throw new BadRequestException('訂單金額不符合');
    }
    const order = await this.prisma.merchantOrder.create({
      data: {
        trade_no: d.transaction_id,
        expired_at: new Date(d.expired),
        price: +d.real_price,
        merchant_id: record.merchant_id,
        status: 1,
        record_id: record.id,
        pay_code: d.bank_owner === 'CVS' ? d.bank_no : null,
        bank_code: d.bank_owner === 'ATM' ? d.bank_from : null,
        bank_account: d.bank_owner === 'ATM' ? d.bank_no : null,
        extra: {
          qr_url: d.qr_url,
          view_url: d.view_url,
        },
      },
    });

    return order;
  }

  async notify_QIYU(data: Notify_QIYU) {
    try {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: MerchantCode.QIYU,
          data: data as unknown as Prisma.InputJsonValue,
        },
      });

      const config = (
        await this.prisma.$queryRaw(getMerchantConfigByRecord(data.order_id))
      )[0].merchant_config;

      const valid_sign = data.sign;
      delete data.extra;
      delete data.sign;
      const sign = this.getSign_QIYU(data, config.hash_key);
      return valid_sign === sign ? 'OK' : 'ERROR';
    } catch (err) {
      throw new BadRequestException('Error');
    }
  }
}

interface Notify_QIYU {
  customer_id: number;
  order_id: string;
  transaction_id: string;
  order_amount: number;
  real_amount: number;
  sign: string;
  status: string;
  message: string;
  extra?: any;
}
