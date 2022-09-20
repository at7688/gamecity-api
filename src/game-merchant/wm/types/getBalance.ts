import { WmResBase } from './base';

export interface WmGetBalanceReq {
  agent: string;
  account: string;
}

export interface WmGetBalanceRes extends WmResBase {
  balance: string;
}
