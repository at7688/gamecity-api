import { OgResBase } from './base';

export interface OgTransferToReq {
  transactionId: string;
  amount: number;
  player: string;
}

export type OgTransferToRes = OgResBase<{
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
