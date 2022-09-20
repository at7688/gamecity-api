import { WmResBase } from './base';

export interface WmTransferToReq {
  cmd: 'ChangeBalance';
  user: string;
  money: number;
  order: string;
}

export type WmTransferToRes = WmResBase<{
  yourOrderNum: string;
  orderId: string;
  cash: string;
}>;
