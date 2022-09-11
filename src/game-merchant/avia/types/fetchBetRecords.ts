import { AviaResBase } from '../types';

export enum AviaBetStatus {
  None = 'None',
  Win = 'Win',
  Lose = 'Lose',
}

export interface AviaBetRecordsRes extends AviaResBase {
  info: AviaBetRecordsInfo;
}

export interface AviaBetRecordsInfo {
  RecordCount: number;
  PageIndex: number;
  PageSize: number;
  data: null;
  list: AviaBetRecordsList[];
}

export interface AviaBetRecordsList {
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
  Status: AviaBetStatus;
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
