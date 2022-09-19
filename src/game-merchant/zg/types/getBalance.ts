import { ZgResBase } from './base';

export interface ZgGetBalanceReq {
  agent: string;
  account: string;
}

export interface ZgGetBalanceRes extends ZgResBase {
  balance: string;
}
