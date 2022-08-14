import { Prisma } from '@prisma/client';

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

SELECT "Member".* FROM getAllParents
JOIN "Member" ON getAllParents.id = "Member".id
`;
