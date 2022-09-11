export enum AviaActionType {
  GET_BALANCE = 'Balance',
  TRANSFER = 'Money',
  TRADE_CHECK = 'Query',
}

export interface AviaBalanceCbReq {
  Action: AviaActionType.GET_BALANCE;
  Sign: string;
  Timestamp: string;
  UserName: string;
}

export enum AviaTransferType {
  BETTING = 'Bet',
  BET_RESULT = 'Reward',
  BET_REFUND = 'Return',
  BET_RESULT_MANUAL = 'ReSettlement',
  PROMOTION = 'Event',
}
export interface AviaTransferCbReq {
  Action: AviaActionType.TRANSFER;
  Timestamp: string;
  Sign: string;
  UserName: string;
  Description: string;
  ID: string;
  Money: string;
  Type: AviaTransferType;
}

export interface AviaTradeCheckCbReq {
  Action: AviaActionType.TRADE_CHECK;
  Timestamp: string;
  Sign: string;
  UserName: string;
  ID: string;
  Type: string;
}

export type AviaCbReq =
  | AviaBalanceCbReq
  | AviaTransferCbReq
  | AviaTradeCheckCbReq;

export interface AviaCbRes {
  success: number;
  msg: string;
  info?: any;
}

export interface AviaReqConfig {
  method: string;
  url: string;
  data: any;
}

export interface AviaResBase {
  success: 1 | 0;
  msg?: string;
  info?: any;
}
