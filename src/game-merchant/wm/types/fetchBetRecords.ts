import { WmResBase } from './base';

export interface WmBetRecordsReq {
  finish_time: {
    start_time: Date | string;
    end_time: Date | string;
  };
  index: number;
  limit: number;
}

export interface WmBetRecordsRes extends WmResBase {
  total: string;
  rows: WmBetRecord[];
}

export interface WmBetRecord {
  id: string;
  bet_at: Date;
  finish_at: Date;
  agent: Agent;
  member: Member;
  game_id: string;
  game_serial: string;
  game_type: number;
  round_id: string;
  bet_amount: number;
  payout_amount: number;
  valid_amount: number;
  fee_amount: number;
  jp_amount: number;
  status: number;
  wallet_token: WalletToken;
  owner: Agent;
  currency: Currency;
  event_id: string;
  event_amount: number;
}

export enum Agent {
  Asg0001UAT = 'ASG0001UAT',
}

export enum Currency {
  Ttt = 'TTT',
}

export enum Member {
  Player99 = 'player99',
}

export enum WalletToken {
  QDqeasqjeOHERkmu6328160F6Ab9Bc2Ea3Ba6092 = 'qDqeasqjeOHERkmu:6328160f6ab9bc2ea3ba6092',
}
