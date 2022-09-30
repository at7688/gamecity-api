import { WmResBase } from './base';

export interface WmTransferCheckReq {
  cmd: 'GetMemberTradeReport';
  order: string;
}

export type WmTransferCheckRes = WmResBase<{
  orderid: string;
  addtime: string;
  money: string;
  op_code: 121 | 122; // 加点(121)扣点(122)
  subtotal: string;
  ordernum: string;
  user: string;
} | null>;
