import { Prisma } from '@prisma/client';

export const companyCardList = (rotation_id: number) => Prisma.sql`
WITH list AS (
SELECT
	c.*,
	(SELECT SUM(amount) FROM "BankDepositRec" r
	 WHERE r.card_id = c.id AND r.created_at > c.accumulate_from
	) current_sum,
	(SELECT SUM(amount) FROM "BankDepositRec" r
	 WHERE r.card_id = c.id
	) total_sum,
	(SELECT json_build_object(
		'id', p.id,
		'nickname', p.nickname,
		'username', p.username,
		'amount', r.amount,
		'created_at', r.created_at
	) FROM "BankDepositRec" r
	 JOIN "Player" p ON p.id = r.player_id
	 WHERE r.card_id = c.id
	 ORDER BY r.created_at DESC
	 LIMIT 1
	) last_record
	FROM "CompanyCard" c
  WHERE rotation_id = ${rotation_id}
)

SELECT
    (SELECT json_agg(list) FROM list) items,
    (SELECT COUNT(*) FROM list) count

`;
