export interface RegisterPayload {
  username: string;
  agent: string;
  inviter: string;
}

export interface WithdrawPayload {
  username: string;
  amount: number;
}

export interface DepositPayload {
  type: 'bank' | 'payment';
  username: string;
  amount: number;
}

export interface PromotionApplyPayload {
  username: string;
  promotion: string;
}

export interface PlayerCardPayload {
  username: string;
  info: string;
}
