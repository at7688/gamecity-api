import { Prisma } from '@prisma/client';

export interface PlayerRolling {
  player_id: string;
  current_rolling: number;
  required_rolling: number;
}

export const playerRolling = (player_id?: string) => Prisma.sql`
SELECT
	COALESCE(current_rolling, 0) current_rolling,
	COALESCE(required_rolling, 0) required_rolling
FROM "Player" p
LEFT JOIN (
	SELECT player_id, SUM(rolling_amount) current_rolling
	FROM "BetRecord"
	WHERE status = 10
	GROUP BY player_id
) r ON r.player_id = p.id
LEFT JOIN (
	SELECT
		player_id,
		SUM(rolling_amount) required_rolling
	FROM "Gift"
	WHERE status = 10
	GROUP BY player_id
) g ON g.player_id = r.player_id

${player_id ? Prisma.sql`WHERE r.player_id = ${player_id}` : Prisma.empty}

`;
