import { GrBaseRes } from './base';

export interface GrTransferCheckReq {
  account: string;
  order_id: string;
}

export type GrTransferCheckRes = GrBaseRes<{
  account: string;
  order_id: string;
  order_state: number;
}>;
