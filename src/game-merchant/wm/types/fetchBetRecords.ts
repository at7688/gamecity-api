import { WmResBase } from './base';

export interface WmBetRecordsReq {
  cmd: 'GetDateTimeReport';
  user?: string;
  startTime: string;
  endTime: string;
}

export type WmBetRecordsRes = WmResBase<WmBetRecord[]>;

export interface WmBetRecord {
  user: string;
  betId: string;
  betTime: Date;
  beforeCash: string;
  bet: string;
  validbet: string;
  water: string;
  result: string;
  betCode: string;
  waterbet: string;
  winLoss: string;
  ip: string;
  gid: string;
  event: string;
  eventChild: string;
  round: string;
  subround: string;
  tableId: string;
  commission: string;
  settime: Date;
  reset: string;
  betResult: string;
  gameResult: string;
  gname: string;
}
