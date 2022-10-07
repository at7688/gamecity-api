export interface RegisterPayload {
  username: string;
  nickname: string;
  agent_nickname: string;
  agent_username: string;
  inviter_username: string;
  inviter_nickname: string;
  master_agent_nickname?: string;
  master_agent_username?: string;
  time: Date;
}

export interface WithdrawPayload {
  id: string;
  status: 'finish' | 'apply';
  created_at: Date;
  finished_at?: Date;
  username: string;
  nickname: string;
  amount: number;
  vip_name: string;
  count: number;
  agent_nickname: string;
  agent_username: string;
}

export interface DepositPayload {
  type: 'bank' | 'payment';
  status: 'finish' | 'apply';
  id: string;
  created_at: Date;
  finished_at?: Date;
  username: string;
  nickname: string;
  amount: number;
  vip_name: string;
  count?: number;
  agent_nickname: string;
  agent_username: string;
}

export interface PromotionApplyPayload {
  username: string;
  promotion: string;
}

export interface PlayerCardPayload {
  username: string;
  info: string;
}
