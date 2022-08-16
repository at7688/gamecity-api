import { Prisma } from '@prisma/client';

export const getAllSubs = (id: string) => Prisma.sql`
WITH RECURSIVE get_childs(id, username, nickname, parent_id, layer) AS (
  SELECT
    id,
    username,
    nickname,
    parent_id,
    layer
  FROM "Member"
  ${
    id
      ? Prisma.sql`WHERE parent_id = ${id}`
      : Prisma.sql`WHERE parent_id IS NULL`
  }

  UNION
  SELECT "Member".id, "Member".username, "Member".nickname, "Member".parent_id,  "Member".layer
  FROM "Member"
  JOIN get_childs ON get_childs.id = "Member".parent_id
)

SELECT * FROM get_childs
`;
