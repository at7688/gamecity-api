import { AbResBase } from './base';

export interface AbBetRecordsReq {
  player?: string;
  pageSize?: number;
  start?: number;
  end?: number;
}
export type AbBetRecordsRes = AbResBase<AbBetRecord[]>;

export interface AbBetRecord {
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
