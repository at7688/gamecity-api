import { BngResBase } from './base';

export interface BngGetBalanceReq {
  agent: string;
  account: string;
}

export interface BngGetBalanceRes extends BngResBase {
  balance: string;
}
