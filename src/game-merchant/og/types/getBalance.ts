import { OgResBase } from './base';

export interface OgGetBalanceReq {
  account: string;
}

export type OgGetBalanceRes = OgResBase<OgPlayerInfo[]>;

export interface OgPlayerInfo {
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
