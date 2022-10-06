import { Prisma } from '@prisma/client';
import { SearchPlayerReportDto } from '../dto/search-player-report.dto';

export const playerReport = (search: SearchPlayerReportDto) => {
  const { start_at, end_at, username = '', layers, parent_id } = search;
  return Prisma.sql`
    SELECT
    id,
    nickname,
    username,
    layer,
    (
        SELECT json_agg(pp) FROM (
          WITH RECURSIVE parents AS (
            SELECT * FROM "Member"
            WHERE id = m.parent_id
          UNION
            SELECT n.* FROM "Member" n
            JOIN parents ON parents.parent_id = n.id
          )

          SELECT id, nickname, username, layer FROM parents
          ORDER BY layer
        ) pp
      ) parents,
      (
        SELECT COUNT(*)
        FROM (
          SELECT DISTINCT player_id FROM (
            WITH RECURSIVE subAgents AS (
              SELECT * FROM "Member" WHERE username = m.username
              UNION
              SELECT m.* FROM "Member" m
              JOIN subAgents s ON s.id = m.parent_id
            )
            SELECT * FROM subAgents
          ) a
          JOIN "Player" p ON p.agent_id = a.id
          JOIN "LoginRec" r ON r.player_id = p.id
          WHERE login_at BETWEEN ${start_at} AND ${end_at}
        ) gg
      ) login_player_count,
      (
        SELECT COUNT(*) FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
        WHERE p.created_at BETWEEN ${start_at} AND ${end_at}
      ) register_player_count,
      (
        SELECT COUNT(*) FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
      ) player_count

    FROM "Member" m
    WHERE
      m.username LIKE '%' || ${username} || '%'
      ${
        layers?.length
          ? Prisma.sql`AND m.layer IN (${Prisma.join(layers)})`
          : Prisma.empty
      }
      ${parent_id ? Prisma.sql`AND m.parent_id = ${parent_id}` : Prisma.empty}

  `;
};
