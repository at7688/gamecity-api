import { Prisma } from '@prisma/client';

export interface VipCheckItem {
  player_id: string;
  current_deposit: number;
  current_valid: number;
  vip_id: string;
}

export const vipCheck = (
  deposit_ids: string[],
  bet_ids: string[],
) => Prisma.sql`
SELECT
	*,
	(
		SELECT id FROM "Vip"
	 	WHERE current_deposit > deposit_min AND current_valid > valid_bet
		ORDER BY sort DESC
		LIMIT 1
	) vip_id
FROM (
	SELECT
		d.player_id,
		COALESCE(d.current_deposit, 0) current_deposit,
		b.current_valid
	FROM (
		SELECT
			player_id,
			SUM(amount) current_deposit
		FROM "PaymentDepositRec"
    ${
      deposit_ids.length
        ? Prisma.sql`WHERE id IN (${Prisma.join(deposit_ids)})`
        : Prisma.empty
    }

		GROUP BY player_id
	) d
	FULL JOIN (
		SELECT
			player_id,
			SUM(valid_amount) current_valid
		FROM "BetRecord"
    ${
      bet_ids.length
        ? Prisma.sql`WHERE id IN (${Prisma.join(bet_ids)})`
        : Prisma.empty
    }
		GROUP BY player_id
	) b ON b.player_id = d.player_id
) m

`;
