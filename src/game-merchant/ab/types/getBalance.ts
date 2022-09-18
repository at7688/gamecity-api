import { AbResBase } from './base';

export interface AbGetBalanceReq {
  account: string;
}

export type AbGetBalanceRes = AbResBase<AbPlayerInfo[]>;

export interface AbPlayerInfo {
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
