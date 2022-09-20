import { WmResBase } from './base';

export interface WmGetBalanceReq {
  cmd: 'GetBalance';
  user: string;
}

export type WmGetBalanceRes = WmResBase<number>;
