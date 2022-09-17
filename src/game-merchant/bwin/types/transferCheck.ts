import { BwinResBase } from './base';

export interface BwinTransferCheckReq {
  account: string;
  order_id: string;
}

export type BwinTransferCheckRes = BwinResBase<{
  account: string;
  order_id: string;
  order_state: number;
}>;
