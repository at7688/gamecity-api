import { BwinResBase } from './base';

export interface BwinTransferBackReq {
  transactionId: string;
  amount: number;
  player: string;
}

export type BwinTransferBackRes = BwinResBase<{
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
