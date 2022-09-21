export interface OgBetReq {
  game_id: number;
  records: Record[];
  currency: string;
  round_id: string;
  called_at: number;
  player_id: string;
  signature: string;
  timestamp: number;
  total_amount: string;
  transaction_type: string;
}

export interface Record {
  amount: string;
  remark: any[];
  bet_place: string;
  other_info: any[];
  secondary_info: SecondaryInfo;
  transaction_id: string;
}

export interface SecondaryInfo {
  bet_amount: string;
  detain_amount: string;
}
