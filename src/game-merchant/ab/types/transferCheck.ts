import { AbResBase } from './base';

export interface AbTransferCheckReq {
  account: string;
  order_id: string;
}

export type AbTransferCheckRes = AbResBase<{
  account: string;
  order_id: string;
  order_state: number;
}>;
