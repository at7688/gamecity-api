import { AbResBase } from './base';

export interface AbTransferBackReq {
  sn: string;
  agent: string;
  amount: number;
  player: string;
  type: 0;
}

export type AbTransferBackRes = AbResBase;
