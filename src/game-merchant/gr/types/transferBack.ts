import { GrResBase } from './base';

export interface GrTransferBackReq {
  account: string;
  debit_amount: number;
  order_id: string;
}

export type GrTransferBackRes = GrResBase<{
  account: string;
  balance: number;
  order_id: string;
  debit_amount: number;
  c_type: string;
}>;
