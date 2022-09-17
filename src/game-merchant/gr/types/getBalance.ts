import { GrBaseRes } from './base';

export interface GrGetBalanceReq {
  account: string;
}

export type GrGetBalanceRes = GrBaseRes<{
  balance: number;
  account: string;
  c_type: string;
}>;
