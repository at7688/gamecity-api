import { AbResBase } from './base';

export interface AbBetRecordsReq {
  agent?: string;
  pageSize: number;
  pageNum: number;
  startDateTime: string; // yyyy-MM-dd HH:mm:ss
  endDateTime: string; // yyyy-MM-dd HH:mm:ss
}
export type AbBetRecordsRes = AbResBase<{
  startDateTime: Date;
  endDateTime: Date;
  total: number;
  pageSize: number;
  pageNum: number;
  list: AbBetRecord[];
}>;

export interface AbBetRecord {
  player: string;
  betNum: number;
  betTime: Date;
  gameRoundId: number;
  betAmount: number;
  validAmount: number;
  winOrLossAmount: number;
  gameType: number;
  status: number;
  currency: string;
  betType: number;
  gameResult: string;
  exchangeRate: number;
  gameRoundEndTime: Date;
  commission: number;
  tableName: string;
  gameRoundStartTime: Date;
  gameResult2: string;
  appType: number;
  betMethod: number;
  ip: string;
  deposit: number;
}
