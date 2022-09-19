import { ZgResBase } from './base';

export interface ZgTransferToReq {
  account: string;
  credit_amount: number;
  order_id: string;
}

export type ZgTransferToRes = ZgResBase<{
  account: string;
  balance: number;
  order_id: string;
  credit_amount: number;
  c_type: string;
}>;
