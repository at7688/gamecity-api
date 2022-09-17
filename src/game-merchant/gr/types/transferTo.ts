import { GrBaseRes } from './base';

export interface GrTransferToReq {
  account: string;
  credit_amount: number;
  order_id: string;
}

export type GrTransferToRes = GrBaseRes<{
  account: string;
  balance: number;
  order_id: string;
  credit_amount: number;
  c_type: string;
}>;
