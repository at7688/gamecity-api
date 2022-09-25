import { WalletRecType } from '../enums';

export class CreateWalletRecDto {
  type: WalletRecType;
  player_id?: string;
  agent_id?: string;
  amount: number;
  source: string;
  fee?: number = 0;
  operator_id?: string;
  note?: string;
  relative_id?: string;
  rolling_amount?: number;
}
