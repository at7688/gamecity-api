export interface QIYU_Notify {
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

export interface QIYU_CreateOrder {
  pay_customer_id: string;
  pay_apply_date: number;
  pay_order_id: string;
  pay_channel_id: number;
  pay_notify_url: string;
  pay_amount: number;
  user_name: string;
  pay_md5_sign?: string;
}

export interface QIYU_OrderRes {
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
