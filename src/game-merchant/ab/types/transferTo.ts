import { AbResBase } from './base';

export interface AbTransferToReq {
  transactionId: string;
  amount: number;
  player: string;
}

export type AbTransferToRes = AbResBase<{
  parentId: number;
  parent: string;
  playerId: number;
  username: string;
  transactionId: string;
  method: string;
  amount: number;
  balance: number;
  promo: number;
  isPromo: boolean;
}>;
