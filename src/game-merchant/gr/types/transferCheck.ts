import { GrResBase } from './base';

export interface GrTransferCheckReq {
  account: string;
  order_id: string;
}

export type GrTransferCheckRes = GrResBase<{
  account: string;
  order_id: string;
  order_state: number;
}>;
