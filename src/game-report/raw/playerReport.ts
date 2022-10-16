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
    -- 下層代理數(為0則不給點擊)
    (
      SELECT COUNT(*) FROM "Member" WHERE parent_id = m.id
    ) agent_count,
    -- 上層代理樹
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
      -- 登入會員數
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
      -- 註冊會員數
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
      -- 總會員數
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
      ) player_count,
-- 	  首儲人數/點數
	  (
        SELECT
		  json_build_object(
			  'count', COUNT(*),
			  'amount', COALESCE(SUM(amount), 0)
		  )
		  FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
	  	JOIN
		  (
			  SELECT player_id, amount, is_first FROM "BankDepositRec"
			  WHERE status = 10 AND created_at BETWEEN ${start_at} AND ${end_at}
			  UNION
			  SELECT player_id, amount, is_first FROM "PaymentDepositRec"
			  WHERE status = 10 AND created_at BETWEEN ${start_at} AND ${end_at}
		  ) r ON r.player_id = p.id
	  	WHERE is_first
      ) first_deposit,
-- 	  儲值人數/次數
	  (
        SELECT
		  json_build_object(
			  'count', COUNT(*),
			  'amount', COALESCE(SUM(amount), 0),
			  'player_count', COUNT(DISTINCT player_id)
		  )
		  FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
	  	JOIN
		  (
			  SELECT player_id, amount, is_first FROM "BankDepositRec"
			  WHERE status = 10 AND created_at BETWEEN ${start_at} AND ${end_at}
			  UNION
			  SELECT player_id, amount, is_first FROM "PaymentDepositRec"
			  WHERE status = 10 AND created_at BETWEEN ${start_at} AND ${end_at}
		  ) r ON r.player_id = p.id
      ) deposit,

-- 	  首次提領人數/總額
	  (
        SELECT
		  json_build_object(
			  'count', COUNT(*),
			  'amount', COALESCE(SUM(amount), 0)
		  )
		  FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
      JOIN "Player" p ON p.agent_id = a.id
	  	JOIN "WithdrawRec" r ON r.player_id = p.id
	  	WHERE status = 10 AND times = 1 AND r.created_at BETWEEN ${start_at} AND ${end_at}
      ) first_withdraw,
-- 	  提領人數/次數
	  (
        SELECT
		  json_build_object(
			  'count', COUNT(*),
			  'amount', COALESCE(SUM(amount), 0),
			  'player_count', COUNT(DISTINCT player_id)
		  )
		  FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )
          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
	  	JOIN "WithdrawRec" r ON r.player_id = p.id
	  	WHERE status = 10 AND r.created_at BETWEEN ${start_at} AND ${end_at}
      ) withdraw

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
