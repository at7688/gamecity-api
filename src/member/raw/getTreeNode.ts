import { Prisma } from '@prisma/client';

export interface TreeNodeMember {
  id: string;
  nickname: string;
  username: string;
  parent_id: null;
  layer: number;
  num_subs: number;
}

export const getTreeNode = (parent_id: string) => Prisma.sql`
SELECT
	id, nickname, username, "Member".parent_id, layer, p.count AS num_subs
FROM "Member"
LEFT JOIN
	(
		SELECT parent_id, COUNT(*)
		FROM "Member"
		GROUP BY parent_id
	) AS p
ON p.parent_id = "Member".id
WHERE "Member".parent_id ${
  parent_id ? Prisma.sql`= ${parent_id}` : Prisma.sql`IS NULL`
}
`;
