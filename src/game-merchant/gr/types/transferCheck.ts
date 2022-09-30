import { GrResBase } from './base';

export interface GrTransferCheckReq {
  account: string;
  order_id: string;
}

export type GrTransferCheckRes = GrResBase<{
  account: string;
  order_id: string;
  order_state: number; // 0. 訂單不存在 1. 訂單處理中 2. 訂單處理成功 3. 訂單處理失敗
}>;
