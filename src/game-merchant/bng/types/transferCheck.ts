import { BngResBase } from './base';

export interface BngTransferCheckReq {
  account_id: number;
  external_order_id: string;
}

export type BngTransferCheckRes = BngResBase<{
  external_order_id: string;
  order_id: string;
  type: string;
  amount: string;
  balance: string;
  status: 'pending' | 'transferred'; // 交易狀態 (pending:擱置 transferred:交易已完成)
}>;
