import { SimpleMember } from './../../types';
import { Prisma } from '@prisma/client';

export interface AgentWithSubNum {
  id: string;
  username: string;
  password: string;
  nickname: string;
  created_at: Date;
  updated_at: Date;
  parent_id: string | null;
  is_active: boolean;
  layer: number;
  is_blocked: boolean;
  balance: number;
  invited_code: string | null;
  all_agents: number;
  self_agents: number;
  self_players: number;
  all_players: number;
  parents?: SimpleMember[];
  login: {
    login_at: Date;
    ip: string;
    nums_failed: number;
  };
}

export const agentWithSubNums = (ids: string[]) => Prisma.sql`
  SELECT
    m.*,
    (
      WITH RECURSIVE allAgents AS (
        SELECT * FROM "Member"
        WHERE parent_id = m.id
      UNION
        SELECT n.* FROM "Member" n
        JOIN allAgents ON allAgents.id = n.parent_id
      )

      SELECT COUNT(*) FROM allAgents
    ) all_agents,
    (SELECT COUNT(*) FROM "Member" n
      WHERE n.parent_id = m.id) self_agents,
    (SELECT COUNT(*) FROM "Player" p
      WHERE p.agent_id = m.id) self_players,
    (
      WITH RECURSIVE allAgents AS (
        SELECT * FROM "Member"
        WHERE id = m.id
      UNION
        SELECT n.* FROM "Member" n
        JOIN allAgents ON allAgents.id = n.parent_id
      )

      SELECT COUNT(*) FROM allAgents a
      JOIN "Player" p ON p.agent_id = a.id
    ) all_players,
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
    (SELECT json_build_object(
        'login_at', l.login_at,
        'ip', l.ip,
        'nums_failed', l.nums_failed
      ) login FROM "LoginRec" l WHERE l.agent_id = m.id
      ORDER BY l.login_at DESC
      LIMIT 1
    ) login
  FROM "Member" m
  WHERE id = ANY(${ids})
  ORDER BY id DESC
`;
