export interface OgBetResultRes {
  type: number;
  amount: number;
  player: string;
  tranId: number;
  details: OgBetResultDetail[];
  isRetry: boolean;
  currency: string;
}

export interface OgBetResultDetail {
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
  togleName: string;
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
