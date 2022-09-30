import { BwinResBase } from './base';

export interface BwinTransferCheckReq {
  id: string;
}

export interface BwinTransferRec {
  id: string;
  createdAt: Date;
  player: string;
  playerId: number;
  parent: string;
  parentId: number;
  operator: string;
  method: string;
  amount: number;
  balance: number;
}

export type BwinTransferCheckRes = BwinResBase<BwinTransferRec[]>;
