import { Prisma } from '@prisma/client';

export const agentReport = (agent_ids?: string[], bet_ids?: string[]) => {
  return Prisma.sql`
  WITH
  filterBets AS (
    SELECT * FROM "BetRecord"
    WHERE id = ANY (${bet_ids})
  )
  SELECT
    *,
    (
      (list.promotion::json->>'duty')::decimal
       + (list.deposit_fee::json->>'duty')::decimal
       + (list.withdraw_fee::json->>'duty')::decimal
       + (list.agent_info::json->>'ratio_result')::decimal
       + (list.agent_info::json->>'water_duty_result')::decimal
       - (list.agent_info::json->>'agent_water_comm')::decimal
    ) settlement
  FROM (
    SELECT
      m.id,
      m.username,
      m.nickname,
      m.layer,
       -- 下層代理數(為0則不給點擊)
      (
        SELECT COUNT(*) FROM "Member" WHERE parent_id = m.id
      ) agent_count,
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
      COALESCE(d.fee_duty, 0) fee_duty,
      COALESCE(d.promotion_duty, 0) promotion_duty,
      (
        SELECT json_build_object(
          'total', COALESCE(gf.amount, 0),
          'duty', COALESCE((d.promotion_duty * gf.amount / 100), 0)
        )
        FROM (
          SELECT SUM(g.amount) amount FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )

          SELECT * FROM subAgents
        ) a
        JOIN "Player" p ON p.agent_id = a.id
        JOIN "Gift" g ON g.player_id = p.id
        ) gf
      ) promotion,
      (
        SELECT json_build_object(
          'total', COALESCE(pf.fee, 0),
          'duty', COALESCE((d.fee_duty * pf.fee / 100), 0)
        ) FROM (
          SELECT SUM(g.fee) fee
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
          JOIN "PaymentDepositRec" g ON g.player_id = p.id
          WHERE status = 10
        ) pf
      ) deposit_fee,
      (
        SELECT json_build_object(
          'total', COALESCE(wf.fee, 0),
          'duty', COALESCE((d.fee_duty * wf.fee / 100), 0)
        ) FROM (
          SELECT SUM(g.fee) fee
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
          JOIN "WithdrawRec" g ON g.player_id = p.id
        ) wf
      ) withdraw_fee,
      (SELECT json_build_object(
        'ratio_result', COALESCE(p.ratio_result, 0),
        'agent_water_comm', COALESCE(p.agent_water_comm, 0),
        'water_duty_result', COALESCE(p.water_duty_result, 0)
      ) FROM (
        SELECT
          SUM(ratio_result) ratio_result,
          ROUND(SUM(agent_water_comm)::decimal, 2) agent_water_comm,
          ROUND(SUM(water_duty_result)::decimal, 2) water_duty_result

        FROM (
          SELECT
            b.id bet_id,
            b.valid_amount,
            b.win_lose_amount,
            r.*,
            (r.ratio * b.win_lose_amount / 100) ratio_result,
            (r.water * b.valid_amount / 100) agent_water_comm,
            (w.water * b.valid_amount / 100) player_water_comm,
            (r.water_duty * (w.water * b.valid_amount / 100) / 100) water_duty_result
          FROM filterBets b
          LEFT JOIN "BetRatioRec" r ON r.bet_id = b.id
          JOIN "Player" p ON p.id = b.player_id
          LEFT JOIN "GameWater" w ON w.vip_id = p.vip_id
            AND w.platform_code = b.platform_code
            AND w.game_code = b.game_code
        ) r
        WHERE agent_id = m.parent_id
      ) p) parent_info,
      json_build_object(
        'ratio_result', COALESCE(a.ratio_result, 0),
        'agent_water_comm', COALESCE(a.agent_water_comm, 0),
        'water_duty_result', COALESCE(a.water_duty_result, 0)
      ) agent_info,
      (SELECT
        json_build_object(
          'amount', COALESCE(SUM(amount), 0),
          'valid_amount', COALESCE(SUM(valid_amount), 0),
          'player_water_comm', COALESCE(ROUND(SUM(player_water_comm)::decimal, 2), 0),
          'win_lose_amount', COALESCE(SUM(win_lose_amount), 0),
          'player_count', COALESCE(COUNT(DISTINCT player_id), 0),
          'count', COALESCE(COUNT(id), 0)
        )
      FROM (
        SELECT
          b.*,
          agents.id agent_id,
          COALESCE((w.water * b.valid_amount / 100), 0) player_water_comm
        FROM (
          WITH RECURSIVE subAgents AS (
            SELECT * FROM "Member" WHERE username = m.username
            UNION
            SELECT m.* FROM "Member" m
            JOIN subAgents s ON s.id = m.parent_id
          )

          SELECT * FROM subAgents
        ) agents
        JOIN "Player" p ON p.agent_id = agents.id
        LEFT JOIN filterBets b ON b.player_id = p.id
        LEFT JOIN "GameWater" w
          ON w.vip_id = p.vip_id
          AND w.platform_code = b.platform_code
          AND w.game_code = b.game_code
      ) qq) bet_info
    FROM "Member" m
    LEFT JOIN "AgentDuty" d ON d.agent_id = m.id
    LEFT JOIN (
      SELECT
      agent_id,
      SUM(valid_amount) valid_amount,
      SUM(win_lose_amount) win_lose_amount,
      SUM(ratio_result) ratio_result,
      ROUND(SUM(agent_water_comm)::decimal, 2) agent_water_comm,
      ROUND(SUM(player_water_comm)::decimal, 2) player_water_comm,
      ROUND(SUM(water_duty_result)::decimal, 2) water_duty_result
    FROM (
      SELECT
          b.id bet_id,
          b.valid_amount,
          b.win_lose_amount,
          r.*,
          (r.ratio * b.win_lose_amount / 100) ratio_result,
          (r.water * b.valid_amount / 100) agent_water_comm,
          (w.water * b.valid_amount / 100) player_water_comm,
          (r.water_duty * (w.water * b.valid_amount / 100) / 100) water_duty_result
        FROM filterBets b
        LEFT JOIN "BetRatioRec" r ON r.bet_id = b.id
        JOIN "Player" p ON p.id = b.player_id
        LEFT JOIN "GameWater" w ON w.vip_id = p.vip_id
          AND w.platform_code = b.platform_code
          AND w.game_code = b.game_code
      ) r
      GROUP BY agent_id
    ) a ON a.agent_id = m.id
    WHERE id = ANY (${agent_ids})

  ) list
  `;
};
