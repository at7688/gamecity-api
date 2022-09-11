export interface AbCancelBetRes {
  player: string;
  reason: string;
  tranId: number;
  isRetry: boolean;
  originalTranId: number;
  originalDetails: AbCancelBetDetail[];
}

export interface AbCancelBetDetail {
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
