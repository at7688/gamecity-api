import { Prisma } from '@prisma/client';

export const agentWithSubNums = () => Prisma.sql`
 WITH agents AS (
    SELECT k.id,
      k.username,
      k.password,
      k.nickname,
      k.created_at,
      k.updated_at,
      k.parent_id,
      k.promo_code,
      k.type,
      k.is_active,
      k.layer,
      k.is_blocked,
      ( SELECT json_agg(kk.*) AS json_agg
              FROM ( WITH RECURSIVE get_parent(id, username, nickname, type, layer, parent_id) AS (
                            SELECT "Member".id,
                              "Member".username,
                              "Member".nickname,
                              "Member".type,
                              "Member".layer,
                              "Member".parent_id
                              FROM "Member"
                            WHERE "Member".id = k.parent_id
                          UNION
                            SELECT "Member".id,
                              "Member".username,
                              "Member".nickname,
                              "Member".type,
                              "Member".layer,
                              "Member".parent_id
                              FROM "Member"
                                JOIN get_parent get_parent_1 ON get_parent_1.parent_id = "Member".id
                          )
                    SELECT get_parent.id,
                      get_parent.username,
                      get_parent.nickname,
                      get_parent.type,
                      get_parent.layer,
                      get_parent.parent_id
                      FROM get_parent
                    ORDER BY get_parent.layer) kk) AS parents,
      ( WITH RECURSIVE cte(id, username, type, parent_id) AS (
                    SELECT m.id,
                      m.username,
                      m.type,
                      m.parent_id
                      FROM "Member" m
                    WHERE m.parent_id = k.id
                  UNION
                    SELECT s.id,
                      s.username,
                      s.type,
                      s.parent_id
                      FROM "Member" s
                        JOIN cte cte_1 ON cte_1.id = s.parent_id
                  )
            SELECT count(*) AS count
              FROM cte
            WHERE cte.type = 'PLAYER'::"MemberType") AS all_players,
      ( WITH RECURSIVE cte(id, username, type, parent_id) AS (
                    SELECT m.id,
                      m.username,
                      m.type,
                      m.parent_id
                      FROM "Member" m
                    WHERE m.parent_id = k.id
                  UNION
                    SELECT s.id,
                      s.username,
                      s.type,
                      s.parent_id
                      FROM "Member" s
                        JOIN cte cte_1 ON cte_1.id = s.parent_id
                  )
            SELECT count(*) AS count
              FROM cte
            WHERE cte.type = 'AGENT'::"MemberType") AS all_agents,
      ( SELECT count(*) AS count
              FROM "Member"
            WHERE "Member".parent_id = k.id AND "Member".type = 'AGENT'::"MemberType") AS self_agents,
      ( SELECT count(*) FROM "Player" p
            WHERE p.agent_id = k.id) AS self_players
      FROM "Member" k
    WHERE k.type = 'AGENT'::"MemberType"
  )

 SELECT f.*,
    l.login_at,
    l.ip,
    l.nums_failed
    FROM agents f
    LEFT JOIN (
      SELECT DISTINCT ON ("LoginRec".agent_id) "LoginRec".agent_id,
        "LoginRec".login_at,
        "LoginRec".ip,
        "LoginRec".nums_failed,
        "LoginRec".failed_msg
        FROM "LoginRec"
      WHERE "LoginRec".agent_id IS NOT NULL
      ORDER BY "LoginRec".agent_id, "LoginRec".login_at DESC
    ) l ON f.id = l.agent_id;
    ORDER
`;
