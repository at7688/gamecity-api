import { Prisma } from '@prisma/client';

export interface CardInfo {
  card_id: string;
  deposit_max: number;
  is_active: boolean;
  is_rotate: boolean;
  rotation_id: number;
  vip_id: string;
  player_id: string;
  prev_card_id: null;
  next_card_id: string;
}
export const getCurrentCard = (player_id: string) => Prisma.sql`
WITH bankCardRotation AS (
SELECT c.id card_id, c.deposit_max, c.is_active, c.is_rotate, r.id rotation_id, v.id vip_id, p.id player_id  FROM "CompanyCard" c
JOIN "RotationGroup" r ON c.rotation_id = r.id
JOIN "Vip" v ON v.card_rotate_id = r.id
JOIN "Player" p ON p.vip_id = v.id
WHERE c.is_rotate AND c.is_active
ORDER BY c.sort
)

SELECT
	*,
	LAG(card_id) OVER () prev_card_id,
	LEAD(card_id) OVER () next_card_id
	FROM bankCardRotation
WHERE player_id = ${player_id}
`;
