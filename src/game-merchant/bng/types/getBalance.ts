import { BngResBase } from './base';

export interface BngGetBalanceReq {
  account_id: number;
  username: string;
}

export type BngGetBalanceRes = BngResBase<{
  balance: string;
  currency: string;
}>;
