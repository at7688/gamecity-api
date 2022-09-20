import { BngResBase } from './base';

export interface BngTransferBackReq {
  account_id: number;
  username: string;
  take_all: true;
  external_order_id: string;
}

export type BngTransferBackRes = BngResBase<{
  balance: string;
  currency: string;
  order_id: string;
  external_order_id: string;
}>;
