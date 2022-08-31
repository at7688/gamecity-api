import MD5 from 'crypto-js/md5';
import { orderBy } from 'lodash/orderBy';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { getUnixTime } from 'date-fns';
import axios from 'axios';

interface OrderInfo {
  config: any;
  order_id: string;
  amount: number;
  pay_code: string;
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

  async createOrder_QIYU({ config, order_id, amount, pay_code }: OrderInfo) {
    const { merchant_no, hash_key } = config;
    interface QIYU_CreateOrder {
      pay_customer_id: string;
      pay_apply_date: number;
      pay_order_id: string;
      pay_channel_id: number;
      pay_notify_url: string;
      pay_amount: number;
      pay_md5_sign?: string;
    }
    const request: QIYU_CreateOrder = {
      pay_customer_id: merchant_no,
      pay_apply_date: getUnixTime(new Date()),
      pay_order_id: order_id,
      pay_channel_id: +pay_code,
      pay_notify_url: 'https://gamecityapi.kidult.one?a=3',
      pay_amount: amount,
    };

    request.pay_md5_sign = this.getSign_QIYU(request, hash_key);

    const res = await axios.post('https://qiyu588.com/pay/pay_order', request);
  }
}
