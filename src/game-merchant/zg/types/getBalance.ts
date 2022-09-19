import { ZgResBase } from './base';

export interface ZgGetBalanceReq {
  account: string;
}

export type ZgGetBalanceRes = ZgResBase<{
  balance: number;
  account: string;
  c_type: string;
}>;
