import { OgResBase } from './base';

export interface OgTransferCheckReq {
  account: string;
  order_id: string;
}

export type OgTransferCheckRes = OgResBase<{
  account: string;
  order_id: string;
  order_state: number;
}>;
