import { ZgResBase } from './base';

export interface ZgTransferCheckReq {
  account: string;
  order_id: string;
}

export type ZgTransferCheckRes = ZgResBase<{
  account: string;
  order_id: string;
  order_state: number;
}>;
