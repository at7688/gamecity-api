import { OgResBase } from './base';

export interface OgTransferBackReq {
  transactionId: string;
  amount: number;
  player: string;
}

export type OgTransferBackRes = OgResBase<{
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
