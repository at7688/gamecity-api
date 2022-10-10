import { Prisma } from '@prisma/client';

export interface Parent {
  id: string;
  nickname: string;
  username: string;
  layer: number;
}

export interface PlayerItem {
  id: string;
  username: string;
  password: string;
  nickname: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_blocked: boolean;
  vip_id: string;
  agent_id: string;
  inviter_id: null;
  is_lock_bet: boolean;
  balance: number;
  invited_code: string;
  parents: Parent[];
  total_amount: number;
  last_amount: number;
  last_deposit_at: Date;
  withdraw_count: number;
  last_withdraw_at: Date | null;
  login_at: Date;
  ip: string;
  nums_failed: number;
  vip_name: string;
  vip_icon: string;
  phone: string;
  email: string;
  telegram: null;
  line_id: null;
}

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
    COALESCE(total_deposit_amount, 0) total_deposit_amount,
    COALESCE(last_deposit_amount, 0) last_deposit_amount,
    last_deposit_at,
    COALESCE(withdraw_count, 0) withdraw_count,
    last_withdraw_at,
    COALESCE(last_withdraw_amount, 0) last_withdraw_amount,
    COALESCE(total_withdraw_amount, 0) total_withdraw_amount,
    login_at,
    ip,
    COALESCE(nums_failed, 0) nums_failed,
    v.name vip_name,
    v.id vip_id,
    v.icon vip_icon,
    c.phone,
    c.email,
    c.telegram,
    c.line_id
  FROM "Player" p
  LEFT JOIN (
    SELECT
      player_id,
      SUM(amount) total_deposit_amount
    FROM (
      SELECT player_id, amount, created_at FROM "PaymentDepositRec" WHERE status = 3
      UNION
      SELECT player_id, amount, created_at FROM "BankDepositRec" WHERE status = 3
    ) r
    GROUP BY player_id
  ) t ON t.player_id = p.id
  LEFT JOIN (
  SELECT
    player_id,
    amount last_deposit_amount,
    created_at last_deposit_at
  FROM (
    SELECT
      *,
      ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY created_at DESC) row_num
    FROM (
        SELECT player_id, amount, created_at FROM "PaymentDepositRec" WHERE status = 3
        UNION
        SELECT player_id, amount, created_at FROM "BankDepositRec" WHERE status = 3
      ) r
    ) rr
    WHERE row_num = 1
  ) n ON n.player_id = p.id
  LEFT JOIN (
    SELECT player_id, count withdraw_count FROM "PlayerTag" WHERE type = 2
  ) tag ON tag.player_id = p.id
  LEFT JOIN (
    SELECT
      player_id,
      amount last_withdraw_amount,
      created_at last_withdraw_at
    FROM (
      SELECT
        *,
        ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY created_at DESC)
      FROM "WithdrawRec" WHERE status = 3
    ) r
    WHERE row_number = 1
  ) wl ON wl.player_id = p.id
  LEFT JOIN (
    SELECT
      player_id,
      SUM(amount) total_withdraw_amount
    FROM (
      SELECT * FROM "WithdrawRec" WHERE status = 3
    ) r
    GROUP BY player_id
  ) w ON w.player_id = p.id
  LEFT JOIN (
    SELECT *
    FROM (
      SELECT
        *,
        ROW_NUMBER() OVER(PARTITION BY player_id ORDER BY login_at DESC)
      FROM "LoginRec"
      WHERE platform = 'PLAYER'
    ) l
    WHERE row_number = 1
  ) o ON o.player_id = p.id
  LEFT JOIN "Vip" v ON v.id = p.vip_id
  LEFT JOIN "Contact" c ON c.player_id = p.id
  WHERE p.id = ANY(${ids})
  `;
};
