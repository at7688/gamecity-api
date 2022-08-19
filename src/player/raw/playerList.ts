import { Prisma } from '@prisma/client';

export const playerList = (ids: string[]) => {
  return Prisma.sql`
  SELECT
    p.*,
    (SELECT json_agg(pp) FROM (
      WITH RECURSIVE parents AS (
        SELECT * FROM "Member"
        WHERE id = p.agent_id
        UNION
        SELECT m.* FROM "Member" m
        JOIN parents ON parents.parent_id = m.id
      )
      SELECT id, nickname, username, layer FROM parents
      ORDER BY layer
      ) pp) parents,
    (
      SELECT json_build_object(
        'phone', phone,
        'email', email,
        'line_id', line_id
      ) FROM (
        SELECT phone, email, line_id FROM "Contact"
        WHERE player_id = p.id
      ) pp
    ) contact,
    (
      SELECT json_build_object(
        'id', v.id,
        'name', v.name,
        'icon', v.icon
      ) FROM "Vip" v
      WHERE id = p.vip_id
    ) vip,
    (SELECT json_build_object(
        'login_at', l.login_at,
        'ip', l.ip,
        'nums_failed', l.nums_failed
      ) login FROM "LoginRec" l WHERE l.player_id = p.id
      ORDER BY l.login_at DESC
      LIMIT 1
    ) login

    FROM "Player" p

  WHERE id = ANY(${ids})
  ORDER BY id
  `;
};
