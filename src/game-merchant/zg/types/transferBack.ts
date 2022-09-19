import { ZgResBase } from './base';

export interface ZgTransferBackReq {
  account: string;
  debit_amount: number;
  order_id: string;
}

export type ZgTransferBackRes = ZgResBase<{
  account: string;
  balance: number;
  order_id: string;
  debit_amount: number;
  c_type: string;
}>;
