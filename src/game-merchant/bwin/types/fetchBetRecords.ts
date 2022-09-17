import { BwinResBase } from './base';

export interface BwinBetRecordsReq {
  player?: string;
  pageSize?: number;
  start?: number;
  end?: number;
}
export type BwinBetRecordsRes = BwinResBase<BwinBetRecord[]>;

export interface BwinBetRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  win: number;
  bet: number;
  status: string;
  parentId: number;
  parent: string;
  playerId: number;
  player: string;
  gameId: number;
  game: string;
  gameType: string;
  productId: string;
  currency: string;
  setId: number;
  prefix: string;
  txnId: string;
  supplier: string;
  supplierPrefix: string;
  endAt: Date;
  validBet: number;
  result: number;
}
