import { Prisma } from '@prisma/client';

export interface RangeCountsInfo {
  delivered_gift_count: number;
  recieved_gift_amount: number;
  withdraw_amount: number;
  active_player_count: number;
  payment_deposit_amount: number;
  bank_deposit_amount: number;
  first_payment_deposit_amount: number;
  first_bank_deposit_amount: number;
  first_payment_deposit_player_count: number;
  first_bank_deposit_player_count: number;
}

export const getRangeCounts = () => Prisma.sql`

SELECT
	(SELECT COUNT(*) FROM "Gift" WHERE status > 1) delivered_gift_count,
	(SELECT SUM(amount) FROM "Gift" WHERE status = 3) recieved_gift_amount,
	(SELECT SUM(amount) FROM "WithdrawRec") withdraw_amount,
	(SELECT COUNT(*) FROM (SELECT DISTINCT player_id FROM "BetRecord") list) active_player_count,
	(SELECT SUM(amount) FROM "PaymentDepositRec") payment_deposit_amount,
	(SELECT SUM(amount) FROM "BankDepositRec") bank_deposit_amount,
	(SELECT SUM(amount) FROM "PaymentDepositRec" WHERE is_first = true) first_payment_deposit_amount,
	(SELECT SUM(amount) FROM "BankDepositRec" WHERE is_first = true) first_bank_deposit_amount,
	(SELECT COUNT(*) FROM (SELECT DISTINCT player_id FROM "PaymentDepositRec" WHERE is_first = true) list) first_payment_deposit_player_count,
	(SELECT COUNT(*) FROM (SELECT DISTINCT player_id FROM "BankDepositRec" WHERE is_first = true) list) first_bank_deposit_player_count


`;
