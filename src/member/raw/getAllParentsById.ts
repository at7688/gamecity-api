import { MemberType, Prisma } from '@prisma/client';

export const getAllParentsById = (id: string) => Prisma.sql`
WITH RECURSIVE get_parents(id, username, nickname, parent_id, type, layer) AS (
  SELECT id, username, nickname, parent_id, type, layer FROM "Member"
  WHERE id = ${id}
  UNION
  SELECT "Member".id, "Member".username, "Member".nickname, "Member".parent_id, "Member".type, "Member".layer
  FROM "Member"
  JOIN get_parents ON get_parents.parent_id = "Member".id
)

SELECT * FROM get_parents ORDER BY layer ASC
`;
