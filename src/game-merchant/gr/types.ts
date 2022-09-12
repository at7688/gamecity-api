export enum GrActionType {
  GET_BALANCE = 'Balance',
  TRANSFER = 'Money',
  TRADE_CHECK = 'Query',
}

export interface GrBalanceCbReq {
  Action: GrActionType.GET_BALANCE;
  Sign: string;
  Timestamp: string;
  UserName: string;
}

export enum GrTransferType {
  BETTING = 'Bet',
  BET_RESULT = 'Reward',
  BET_REFUND = 'Return',
  BET_RESULT_MANUAL = 'ReSettlement',
  PROMOTION = 'Event',
}
export interface GrTransferCbReq {
  Action: GrActionType.TRANSFER;
  Timestamp: string;
  Sign: string;
  UserName: string;
  Description: string;
  ID: string;
  Money: string;
  Type: GrTransferType;
}

export interface GrTradeCheckCbReq {
  Action: GrActionType.TRADE_CHECK;
  Timestamp: string;
  Sign: string;
  UserName: string;
  ID: string;
  Type: string;
}

export type GrCbReq =
  | GrBalanceCbReq
  | GrTransferCbReq
  | GrTradeCheckCbReq;

export interface GrCbRes {
  success: number;
  msg: string;
  info?: any;
}

export interface GrReqConfig {
  method: string;
  url: string;
  data: any;
}

export interface GrResBase {
  success: 1 | 0;
  msg?: string;
  info?: any;
}
