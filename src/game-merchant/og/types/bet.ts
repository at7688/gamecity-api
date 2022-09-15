export interface OgBetRes {
  type: number;
  amount: number;
  player: string;
  tranId: number;
  details: OgBetDetail[];
  isRetry: boolean;
  currency: string;
}

export interface OgBetDetail {
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
  gameRoundId: number;
  exchangeRate: number;
  gameRoundStartTime: Date;
}
