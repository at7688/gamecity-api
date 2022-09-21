export interface OgCancelBetRes {
  player: string;
  reason: string;
  tranId: number;
  isRetry: boolean;
  originalTranId: number;
  originalDetails: OgCancelBetDetail[];
}

export interface OgCancelBetDetail {
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
