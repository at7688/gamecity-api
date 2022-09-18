export interface AbCancelBetRes {
  player: string;
  reason: string;
  tranId: number;
  isRetry: boolean;
  originalTranId: number;
  originalDetails: AbCancelBetDetail[];
}

export interface AbCancelBetDetail {
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
  gameRoundId: number;
  exchangeRate: number;
  gameRoundStartTime: Date;
}
