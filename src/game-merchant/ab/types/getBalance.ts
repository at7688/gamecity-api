import { AbResBase } from './base';

export interface AbGetBalanceReq {
  agent?: string;
  pageSize: number;
  pageIndex: number;
  recursion: 1 | 0; // 0: 指定代理下的直属玩家 , 1：所有下线玩家
  players?: string[];
}

export type AbGetBalanceRes = AbResBase<{
  count: number;
  list: PlayerBalanceInfo[];
}>;

export interface PlayerBalanceInfo {
  amount: number;
  player: string;
  currency: string;
}
