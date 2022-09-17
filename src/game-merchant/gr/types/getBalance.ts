import { GrResBase } from './base';

export interface GrGetBalanceReq {
  account: string;
}

export type GrGetBalanceRes = GrResBase<{
  balance: number;
  account: string;
  c_type: string;
}>;
