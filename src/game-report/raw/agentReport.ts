import { Prisma } from '@prisma/client';

export const agentReport = (agent_ids: string[], bet_ids: string[]) => {
  return Prisma.sql`
  WITH filterBets AS (
    SELECT * FROM "BetRecord"
    WHERE id IN (${Prisma.join(bet_ids)})
  )
  SELECT
    m.username,
    a.*,
    (SELECT
       json_build_object(
        'amount', COALESCE(SUM(amount), 0),
        'valid_amount', COALESCE(SUM(valid_amount), 0),
        'player_water_comm', COALESCE(ROUND(SUM(player_water_comm)::decimal, 2), 0),
        'win_lose_amount', COALESCE(SUM(win_lose_amount), 0)
      )
     FROM (
      SELECT
        b.*,
        agents.id agent_id,
        (w.water * b.valid_amount / 100) player_water_comm
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
      JOIN filterBets b ON b.player_id = p.id
      JOIN "GameWater" w
        ON w.vip_id = p.vip_id
        AND w.platform_code = b.platform_code
        AND w.game_code = b.game_code
    ) qq) bet_info
  FROM "Member" m
  JOIN (
    SELECT
      agent_id,
      SUM(ratio_result) ratio_result,
      ROUND(SUM(water_commission)::decimal, 2) agent_water_comm
    FROM (
      SELECT
        r.agent_id,
        (r.ratio * b.win_lose_amount / 100) ratio_result,
        (r.water * b.valid_amount / 100) water_commission
      FROM filterBets b
      JOIN "BetRatioRec" r ON r.bet_id = b.id
    ) r
    GROUP BY agent_id
  ) a ON a.agent_id = m.id
  WHERE id IN (${Prisma.join(agent_ids)})
  `;
};
