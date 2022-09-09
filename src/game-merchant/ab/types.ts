export enum AbTransferType {
  BETTING = 10,
  BET_RESULT = 20,
  BET_RESULT_MANUAL = 21,
  TRANSFER_IN = 30,
  TRANSFER_OUT = 31,
  PROMOTION = 40,
}

// 10: 下注
// 20: 派彩结算
// 21: 手动派彩结算
// 30: 额度转入
// 31: 额度转出
// 40: 活动结算

export interface AbReqConfig {
  method: string;
  path: string;
  data: any;
  md5?: string;
  date?: string;
}

export interface AbResBase {
  resultCode: string;
  message?: string;
  data?: any;
}

export interface AbBetDetail {
  betNum: number;
  gameRoundId: number;
  status: number;
  betAmount: number;
  deposit: number;
  gameType: number;
  betType: number;
  commission: number;
  exchangeRate: number;
  betTime: Date;
  tableName: string;
  betMethod: number;
  appType: number;
  gameRoundStartTime: Date;
  ip: string;
}
export interface AbBetResultDetail {
  ip: string;
  betNum: number;
  status: number;
  appType: number;
  betTime: Date;
  betType: number;
  deposit: number;
  gameType: number;
  betAmount: number;
  betMethod: number;
  tableName: string;
  commission: number;
  gameResult: string;
  gameResult2: string;
  gameRoundId: number;
  validAmount: number;
  exchangeRate: number;
  winOrLossAmount: number;
  gameRoundEndTime: Date;
  gameRoundStartTime: Date;
}
export interface AbTransferResData {
  tranId: number;
  player: string;
  amount: number;
  currency: string;
  type: number;
  reason: string;
  isRetry: boolean;
  details: AbBetDetail[];
}

export interface AbCancelTransferResData {
  player: string;
  reason: string;
  tranId: number;
  isRetry: boolean;
  originalTranId: number;
  originalDetails: AbBetDetail[];
}

export interface AbEventDetail {
  amount: number;
  eventCode: string;
  eventType: number;
  settleTime: Date;
  exchangeRate: number;
  eventRecordNum: number;
}
