import { Prisma } from '@prisma/client';

export interface ParentBasic {
  id: string;
  parent_id: string;
  username: string;
  nickname: string;
  layer: string;
}

export const getAllParents = (parent_id: string) => Prisma.sql`
WITH RECURSIVE getAllParents (id, parent_id, username) AS (
	(
		SELECT id, parent_id, username FROM "Member" AS a
		WHERE id = ${parent_id}
	)
	UNION
	(
		SELECT b.id, b.parent_id, b.username FROM "Member" AS b
		JOIN getAllParents ON b.id = getAllParents.parent_id
	)
)

SELECT m.id, m.username, m.nickname, m.parent_id, m.layer FROM getAllParents
JOIN "Member" m ON getAllParents.id = m.id
ORDER BY layer
`;
