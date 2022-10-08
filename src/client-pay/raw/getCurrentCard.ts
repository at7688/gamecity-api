import { CompanyCard, PlayerCard, Prisma } from '@prisma/client';

export interface CardInfo extends CompanyCard {
  card_id: string;
  rotation_id: number;
  current_sum: number;
  vip_id: string;
}
export const getCurrentCard = (vip_id: string) => Prisma.sql`
WITH bankCardRotation AS (
SELECT
	 c.*, c.id card_id, r.id rotation_id, v.id vip_id,
	(
		SELECT COALESCE(sum(amount), 0) FROM "BankDepositRec" r
		WHERE card_id = c.id AND r.created_at > c.accumulate_from
	) current_sum
FROM "CompanyCard" c
	FULL JOIN "RotationGroup" r ON c.rotation_id = r.id
	FULL JOIN "Vip" v ON v.card_rotate_id = r.id
	WHERE v.id = ${vip_id}
ORDER BY c.sort
)

SELECT
	*,
	LAG(card_id) OVER () prev_card_id,
	LEAD(card_id) OVER () next_card_id
	FROM bankCardRotation
	WHERE is_active AND recharge_max > current_sum

`;
