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
GROUP BY player_card_id
),
latestRecords AS (
	SELECT r.* FROM "WithdrawRec" r
	JOIN (
		SELECT MAX(created_at), player_card_id FROM "WithdrawRec" GROUP BY "player_card_id"
	) c ON r.player_card_id = r.player_card_id AND c.max = r.created_at
)

SELECT
	c.*,
	r.created_at latest_withdraw_at,
	r.amount latest_withdraw_amount,
	(COALESCE(k.count, 0)) total_withdraw_count,
	(COALESCE(k.sum, 0)) total_withdraw_amount
FROM "PlayerCard" c
LEFT JOIN latestRecords r ON r.player_card_id = c.id
LEFT JOIN card_records k ON k.player_card_id = c.id
WHERE
${ids ? Prisma.sql`c.id IN (${Prisma.join(ids)})` : Prisma.empty}
${
  withdraw_start_at
    ? Prisma.sql`AND r.created_at > ${withdraw_start_at}`
    : Prisma.empty
}
`;
