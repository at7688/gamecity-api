import { Prisma } from '@prisma/client';

export interface PlayerRolling {
  player_id: string;
  gift_amount: number;
  rolling_amount: number;
  statuses: PlayerRollingStatus[];
  created_at: Date;
  recieved_at: null;
  username: string;
  nickname: string;
}

export interface PlayerRollingStatus {
  player_id: string;
  status: number;
  count: number;
  amount: number;
  rolling_amount: number;
}

export const playersRolling = (player_ids: string[]) => Prisma.sql`

WITH filterGifts AS (
  SELECT * FROM "Gift"
  WHERE player_id IN (${Prisma.join(player_ids)})
)

SELECT gg.*, b.current_rolling, p.username, p.nickname
FROM (
	SELECT
		g.player_id,
		SUM(g.amount) gift_amount,
		SUM(g.rolling_amount) rolling_amount,
		json_agg(g) statuses,
		(
			SELECT created_at FROM filterGifts
			 WHERE player_id = g.player_id
			 ORDER BY created_at DESC LIMIT 1
		),
		(
			SELECT recieved_at FROM filterGifts
			 WHERE player_id = g.player_id
			 ORDER BY recieved_at DESC LIMIT 1
		)
	FROM (
		SELECT
			player_id,
			status,
			COUNT(*),
			SUM(amount) amount,
			SUM(rolling_amount) rolling_amount

		FROM filterGifts k
		GROUP BY player_id, status
	) g
	GROUP BY g.player_id
) gg
JOIN (
	SELECT
		player_id,
		SUM(rolling_amount) current_rolling
	FROM "BetRecord" r
	GROUP BY player_id
) b ON b.player_id = gg.player_id
JOIN "Player" p ON p.id = gg.player_id

`;
