import { Prisma } from '@prisma/client';

export interface PlayerRolling {
  player_id: string;
  current_rolling: number;
  required_rolling: number;
}

export const playerRolling = (player_id?: string) => Prisma.sql`
SELECT r.*, g.required_rolling FROM (
	SELECT player_id, SUM(rolling_amount) current_rolling
	FROM "BetRecord"
	WHERE status = 2
	GROUP BY player_id
) r
JOIN (
	SELECT
		player_id,
		SUM(rolling_amount) required_rolling
	FROM "Gift"
	WHERE status = 3
	GROUP BY player_id
) g ON g.player_id = r.player_id
${player_id ? Prisma.sql`WHERE r.player_id = ${player_id}` : Prisma.empty}

`;
