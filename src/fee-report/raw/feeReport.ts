import { Prisma } from '@prisma/client';

export const feeReport = (
  agent_ids: string[],
  record_ids: string[],
) => Prisma.sql`
WITH filterRecords AS (
  SELECT * FROM "PaymentDepositRec"
  WHERE id IN (${Prisma.join(record_ids)})
)
SELECT
	m.username,
	(SELECT json_build_object(
		'amount', COALESCE(SUM(rr.amount), 0),
		'fee', COALESCE(SUM(rr.fee), 0),
		'fee_on_player', COALESCE(SUM(rr.fee_on_player), 0),
		'detail', json_agg(rr)
	) FROM (
		WITH RECURSIVE subAgents AS (
			SELECT * FROM "Member" WHERE username = m.username
			UNION
			SELECT m.* FROM "Member" m
			JOIN subAgents s ON s.id = m.parent_id
		)
		SELECT
			type,
			SUM(amount) amount,
			SUM(fee) fee,
			SUM(fee_on_player) fee_on_player
		FROM subAgents a
		JOIN "Player" p ON p.agent_id = a.id
		JOIN "PaymentDepositRec" r  ON r.player_id = p.id
		JOIN "Payway" w ON r.payway_id = w.id
		WHERE status = 2
		GROUP BY type
	) rr) cvs_result
FROM "Member" m
WHERE id IN (${Prisma.join(agent_ids)})

`;
