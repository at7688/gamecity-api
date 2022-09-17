export interface OgBetResultReq {
  amount: string;
  remark: any[];
  game_id: number;
  currency: string;
  round_id: string;
  bet_place: string;
  called_at: number;
  game_code: string;
  player_id: string;
  signature: string;
  timestamp: number;
  other_info: any[];
  result_url: string;
  secondary_info: any[];
  transaction_id: string;
  winlose_amount: string;
  effective_amount: string;
  transaction_type: string;
}
