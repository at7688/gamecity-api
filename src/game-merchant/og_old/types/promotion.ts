export interface OgPromotionRes {
  type: number;
  amount: number;
  player: string;
  reason: string;
  tranId: number;
  details: OgPromotionDetail[];
  isRetry: boolean;
  currency: string;
}

export interface OgPromotionDetail {
  amount: number;
  eventCode: string;
  eventType: number;
  settleTime: Date;
  exchangeRate: number;
  eventRecordNum: number;
}
