import { AbResBase } from './base';

export interface AbTransferToReq {
  sn: string;
  agent: string;
  amount: number;
  player: string;
  type: 1;
}

export type AbTransferToRes = AbResBase;
