import { GrResBase } from './base';

export interface GrTransferToReq {
  account: string;
  credit_amount: number;
  order_id: string;
}

export type GrTransferToRes = GrResBase<{
  account: string;
  balance: number;
  order_id: string;
  credit_amount: number;
  c_type: string;
}>;
