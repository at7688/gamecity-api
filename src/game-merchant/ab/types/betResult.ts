export interface AbBetResultRes {
  type: number;
  amount: number;
  player: string;
  tranId: number;
  details: AbBetResultDetail[];
  isRetry: boolean;
  currency: string;
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
