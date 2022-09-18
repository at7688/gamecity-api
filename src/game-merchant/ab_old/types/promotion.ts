export interface AbPromotionRes {
  type: number;
  amount: number;
  player: string;
  reason: string;
  tranId: number;
  details: AbPromotionDetail[];
  isRetry: boolean;
  currency: string;
}

export interface AbPromotionDetail {
  amount: number;
  eventCode: string;
  eventType: number;
  settleTime: Date;
  exchangeRate: number;
  eventRecordNum: number;
}
