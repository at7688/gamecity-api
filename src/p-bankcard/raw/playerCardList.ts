import { Prisma } from '@prisma/client';
export const playerCardList = (ids: string[]) => Prisma.sql`
SELECT
  c.*,
  json_build_object(
    'id', p.id,
    'username', p.username,
    'nickname', p.nickname
  ) player,
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
    (SELECT json_build_object(
      'id', v.id,
      'name', v.name,
      'icon', v.icon
    ) FROM "Vip" v WHERE v.id = p.vip_id) vip,
  (
    SELECT COALESCE(SUM(r.amount), 0) FROM "WithdrawRec" r
    WHERE player_card_id = c.id AND r.status = 3
  ) withdraw_amount,
  (
    SELECT COUNT(*) FROM "WithdrawRec" r
    WHERE player_card_id = c.id AND r.status = 3
  ) withdraw_count,
  (
    SELECT json_build_object(
      'amount', r.amount,
      'created_at', r.created_at
    ) FROM "WithdrawRec" r
    WHERE player_card_id = c.id AND r.status = 3
    ORDER BY created_at DESC LIMIT 1
  ) last_withdraw

FROM "PlayerCard" c
JOIN "Player" p ON c.player_id = p.id
WHERE c.id IN (${Prisma.join(ids)})
ORDER BY withdraw_amount DESC, withdraw_count DESC
`;
