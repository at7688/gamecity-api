import { Prisma } from '@prisma/client';

export const getAllSubs = (id: string | null) => Prisma.sql`
WITH RECURSIVE getAllSubs (id, username) AS (
	(
		SELECT id, username FROM "Member" AS a
		${
      id
        ? Prisma.sql`WHERE parent_id = ${id}`
        : Prisma.sql`WHERE parent_id IS NULL`
    }
	)
	UNION
	(
		SELECT b.id, b.username FROM "Member" AS b
		JOIN getAllSubs ON b.parent_id = getAllSubs.id
	)
)

SELECT "Member".* FROM getAllSubs
JOIN "Member" ON getAllSubs.id = "Member".id
`;
