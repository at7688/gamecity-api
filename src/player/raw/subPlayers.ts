import { Prisma } from '@prisma/client';

export interface SubPlayer {
  id: string;
  username: string;
  nickname: string;
}

export const subPlayers = (agent_id: string) => Prisma.sql`
WITH RECURSIVE allSubAgentsIncludeSelf(id, parent_id, nickname) AS (
	SELECT id, parent_id, nickname FROM "Member"
	WHERE id = ${agent_id}
	UNION
	SELECT m.id, m.parent_id, m.nickname FROM "Member" m
	JOIN allSubAgentsIncludeSelf g ON m.parent_id = g.id
)

SELECT p.id, p.nickname, p.username FROM allSubAgentsIncludeSelf g
JOIN "Player" p ON p.agent_id = g.id
`;
