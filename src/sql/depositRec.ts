import { Prisma } from '@prisma/client';

export interface DepositRecItem {
  id: string;
  player_id: string;
  amount: number;
  created_at: Date | string;
  status: number;
  is_first?: boolean;
  fee: number;
  fee_on_player: number;
}

export const depositRec = () => Prisma.sql`
SELECT * FROM (
  SELECT id, player_id, amount, created_at, status, is_first, fee, fee_on_player FROM "PaymentDepositRec"
  UNION
  SELECT id, player_id, amount, created_at, status, is_first, 0, 0 FROM "BankDepositRec"
)
`;
