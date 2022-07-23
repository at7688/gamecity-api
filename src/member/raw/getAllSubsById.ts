import { MemberType, Prisma } from '@prisma/client';

export const getAllSubsById = (id: string, type?: MemberType) => Prisma.sql`
WITH RECURSIVE get_childs(id, username, nickname, parent_id, type, layer) AS (
  SELECT
    id,
    username,
    nickname,
    parent_id,
    type,
    layer
  FROM "Member"
  ${
    id
      ? Prisma.sql`WHERE parent_id = ${id}`
      : Prisma.sql`WHERE parent_id IS NULL`
  }

  UNION
  SELECT "Member".id, "Member".username, "Member".nickname, "Member".parent_id, "Member".type, "Member".layer
  FROM "Member"
  JOIN get_childs ON get_childs.id = "Member".parent_id
)

SELECT * FROM get_childs
${type ? Prisma.sql`WHERE get_childs.type = ${type}` : Prisma.empty}
`;
