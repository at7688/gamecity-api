import { Prisma } from '@prisma/client';

export const playerList = (ids: string[]) => {
  return Prisma.sql`
  SELECT p.*, (SELECT json_agg(pp) FROM (
    WITH RECURSIVE parents AS (
      SELECT * FROM "Member"
      WHERE id = p.agent_id
      UNION
      SELECT m.* FROM "Member" m
      JOIN parents ON parents.parent_id = m.id
    )
    SELECT id, nickname, username, layer FROM parents
    ORDER BY layer
  ) pp) parents FROM "Player" p

  WHERE id = ANY(${ids})
  `;
};
