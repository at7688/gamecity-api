import { BngResBase } from './base';

export interface BngTransferToReq {
  account_id: number;
  username: string;
  deposit_amount: number;
  external_order_id: string;
}

export type BngTransferToRes = BngResBase<{
  balance: string;
  currency: string;
  order_id: string;
  external_order_id: string;
}>;
