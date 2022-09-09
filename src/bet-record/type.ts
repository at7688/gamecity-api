export interface BetCreateInput {
  bet_no: string;
  amount: number;
  deposit?: number;
  bet_target: number;
  bet_at: Date | string;
  ip?: string;
  player_id: string;
  platform_code: string;
  game_code: string;
}
