import { Prisma } from '@prisma/client';
export const pagerList = (
  listSql: Prisma.Sql,
  page: number,
  perpage: number,
) => Prisma.sql`
WITH list AS (
  ${listSql}
)

SELECT
    (
      SELECT json_agg(items)
      FROM (SELECT * FROM list OFFSET ${
        (page - 1) * perpage
      }LIMIT ${perpage}) items
    ) items,
    (SELECT COUNT(*) FROM list) count
`;
