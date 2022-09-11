export interface AbBetRes {
  type: number;
  amount: number;
  player: string;
  tranId: number;
  details: AbBetDetail[];
  isRetry: boolean;
  currency: string;
}

export interface AbBetDetail {
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
