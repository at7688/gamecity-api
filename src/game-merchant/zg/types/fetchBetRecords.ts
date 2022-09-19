import { ZgResBase } from './base';

export interface ZgBetRecordsReq {
  account?: string;
  start_time: string;
  end_time: string;
  page_index: number;
  page_size: number;
}
export type ZgBetRecordsRes = ZgResBase<{
  bet_details?: ZgBetRecord[];
  page_index: number;
  page_size: number;
  total_elements: number;
  total_pages: number;
}>;

export interface ZgBetRecord {
  id_str: string;
  id: number;
  sid: string;
  account: string;
  game_type: number;
  game_module_type: number;
  game_round: string;
  bet: number;
  bet_result: string;
  game_result: string;
  valid_bet: number;
  win: number;
  create_time: Date;
  room_id: number;
  table_id: number;
  order_id: string;
  device: string;
  client_ip: string;
  c_type: string;
  profit: number;
}
