import { BngResBase } from './base';

export interface BngBetRecordsReq {
  account_id: number;
  datetime_from: Date | string;
  datetime_to: Date | string;
  page: number;
  page_count: number;
  game_type: string;
  lang: string;
}

export type BngBetRecordsRes = BngResBase<{
  total: number;
  bet_count: number;
  histories: BngBetRecord[];
}>;

export interface BngBetRecord {
  round_id: string;
  order_id: string;
  bet: number;
  win: number;
  valid_bet: number;
  rake_amount: number;
  diff: number;
  username: string;
  game_vendor_name: string;
  game_code: string;
  game_type: string;
  detail_url: string;
  cn_detail_url: string;
  bet_time: Date;
  end_time: Date;
  result_time: Date;
}
