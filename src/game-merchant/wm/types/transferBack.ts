import { WmResBase } from './base';

export interface WmTransferBackReq {
  cmd: 'ChangeBalance';
  user: string;
  money: number;
  order: string;
}

export interface WmTransferBackRes extends WmResBase {
  yourOrderNum: string;
  orderId: string;
  cash: string;
}
