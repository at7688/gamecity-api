import { GrResBase } from '../types';

export enum GrBetStatus {
  None = 'None',
  Win = 'Win',
  Lose = 'Lose',
}

export interface GrBetRecordsRes extends GrResBase {
  info: GrBetRecordsInfo;
}

export interface GrBetRecordsInfo {
  RecordCount: number;
  PageIndex: number;
  PageSize: number;
  data: null;
  list: GrBetRecordsList[];
}

export interface GrBetRecordsList {
  OrderID: string;
  Type: string;
  UserName: string;
  CateID?: string;
  Category?: string;
  LeagueID?: string;
  League?: string;
  MatchID?: string;
  Match?: string;
  BetID?: string;
  Bet?: string;
  Content: string;
  Result: string;
  BetMoney: string;
  BetAmount: string;
  Money: string;
  Status: GrBetStatus;
  CreateAt: string;
  UpdateAt: string;
  Timestamp: string;
  StartAt?: string;
  EndAt?: string;
  ResultAt?: string;
  RewardAt: string;
  OddsType?: string;
  Odds: string;
  IP: string;
  Language?: string;
  Platform?: string[];
  ReSettlement: number;
  IsTest: number;
  Currency: string;
  IsLive?: number;
  Code?: string;
  Index?: string;
  Player?: string;
}
