import { Prisma } from '@prisma/client';

// export interface VipItem {
//   id: string;
//   name: string;
//   icon: null;
//   ebet_min: number;
//   deposite_min: number;
//   withdraw_min: number;
//   withdraw_max: number;
//   card_rotate_id: number;
//   payment_rotate_id: number;
//   card_rotate_name: string;
//   payment_rotate_name: string;
//   nums_player: number;
// }
// export interface VipListRes {
//   items: VipItem[];
//   count: number;
// }
export const vipList = () => Prisma.sql`
  WITH list AS (
    SELECT
      *,
      (
        SELECT name FROM "RotationGroup" r
        WHERE r.id = v.card_rotate_id AND r.type = 1
      ) card_rotate_name,
      (
        SELECT name FROM "RotationGroup" r
        WHERE r.id = v.payment_rotate_id AND r.type = 2
      ) payment_rotate_name,
      (
        SELECT COUNT(*) FROM "Player" p
        WHERE p.vip_id = v.id
      ) nums_player
    FROM "Vip" v
    ORDER BY id
  )

  SELECT
    (SELECT json_agg(list) FROM list) items,
    (SELECT COUNT(*) FROM list) count
`;
