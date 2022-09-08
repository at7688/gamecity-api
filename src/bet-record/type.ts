export interface BetCreateInput {
  bet_no: string;
  round_id: string;
  table_code?: string;
  amount: number;
  deposit?: number;
  bet_target: number;
  commission_type?: number;
  bet_at: Date | string;
  ip?: string;
  player_id: string;
  platform_code: string;
  game_code: string;
}
