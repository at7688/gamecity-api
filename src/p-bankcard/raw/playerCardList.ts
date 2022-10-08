import { Prisma } from '@prisma/client';
import { SearchPBankcardsDto } from '../dto/search-p-bankcards.dto';

export const playerCardList = (
  ids: string[],
  { withdraw_start_at, withdraw_end_at }: SearchPBankcardsDto,
) => Prisma.sql`

WITH
	card_records AS (
	SELECT player_card_id,
			COUNT(*),
			SUM(amount)
	FROM "WithdrawRec" r
	WHERE r.status = 3
	GROUP BY player_card_id
	),

	latestRecords AS (
		SELECT r.* FROM "WithdrawRec" r
		JOIN (
			SELECT MAX(updated_at), player_card_id FROM "WithdrawRec" WHERE status = 3 GROUP BY "player_card_id"
		) c ON r.player_card_id = r.player_card_id AND c.max = r.updated_at
	)

SELECT
	c.*,
	json_build_object(
		'id', p.id,
		'username', p.username,
		'nickname', p.nickname
	 ) player,
	(SELECT json_agg(pp) FROM (
      WITH RECURSIVE parents AS (
        SELECT * FROM "Member"
        WHERE id = p.agent_id
        UNION
        SELECT m.* FROM "Member" m
        JOIN parents ON parents.parent_id = m.id
      )
      SELECT id, nickname, username, layer FROM parents
      ORDER BY layer
      ) pp) parents,
	  (SELECT json_build_object(
		  'id', v.id,
		  'name', v.name,
		  'icon', v.icon
	  ) FROM "Vip" v WHERE v.id = p.vip_id) vip,
	r.updated_at latest_withdraw_at,
	r.amount latest_withdraw_amount,
	(COALESCE(k.count, 0)) total_withdraw_count,
	(COALESCE(k.sum, 0)) total_withdraw_amount
FROM "PlayerCard" c
LEFT JOIN latestRecords r ON r.player_card_id = c.id
LEFT JOIN card_records k ON k.player_card_id = c.id
JOIN "Player" p ON c.player_id = p.id
WHERE
${ids ? Prisma.sql`c.id IN (${Prisma.join(ids)})` : Prisma.empty}
${
  withdraw_start_at
    ? Prisma.sql`AND r.updated_at > ${withdraw_start_at}`
    : Prisma.empty
}
${
  withdraw_end_at
    ? Prisma.sql`AND r.updated_at < ${withdraw_start_at}`
    : Prisma.empty
}
ORDER BY created_at DESC
`;
