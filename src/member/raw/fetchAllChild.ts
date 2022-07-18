import { Prisma } from '@prisma/client';

export const getAllSubsById = (id: string) => Prisma.sql`
WITH RECURSIVE get_child(id, username, nickname, parent_id, type) AS (
  SELECT id, username, nickname, parent_id, type FROM "Member"
  WHERE parent_id = ${id}
  UNION
  SELECT "Member".id, "Member".nickname, "Member".username, "Member".parent_id, "Member".type
  FROM "Member"
  JOIN get_child ON get_child.id = "Member".parent_id
)

SELECT * FROM get_child
`;
