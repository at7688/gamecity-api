import { WalletRecType, WalletStatus } from '../enums';

export interface CreateWalletRecDto {
  type: WalletRecType;
  player_id?: string;
  agent_id?: string;
  amount: number;
  source: string;
  fee?: number;
  operator_id?: string;
  note?: string;
  relative_id?: string;
  rolling_amount?: number;
  status?: WalletStatus;
}
