import { BwinResBase } from './base';

export interface BwinGetBalanceReq {
  account: string;
}

export type BwinGetBalanceRes = BwinResBase<BwinPlayerInfo[]>;

export interface BwinPlayerInfo {
  id: number;
  username: string;
  nickname: string;
  status: string;
  balance: number;
  promo: number;
  parent: string;
  parentId: number;
  createdAt: Date;
  wallets: any[];
}
