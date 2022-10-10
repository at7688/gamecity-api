import { Prisma } from '@prisma/client';

export interface NextVip {
  id: string;
  name: string;
  valid_bet: number;
  deposit_min: number;
}

export interface VipCheckItem {
  id: string;
  username: string;
  nickname: string;
  vip_name: string;
  vip_id: string;
  current_deposit: number;
  current_valid: number;
  next_vip: NextVip;
}

export const vipCheck = (start: Date, end: Date) => {
  return Prisma.sql`
	SELECT
		*,
		(
			SELECT
				json_build_object(
					'id', id,
					'name', name,
					'valid_bet', valid_bet,
					'deposit_min', deposit_min
				)
			FROM "Vip"
			 WHERE current_deposit >= deposit_min AND current_valid >= valid_bet
			ORDER BY sort DESC
			LIMIT 1
		) next_vip
	FROM (
		SELECT
			p.id,
			p.username,
			p.nickname,
			v.name vip_name,
			v.id vip_id,
			COALESCE(d.amount, 0) current_deposit,
			COALESCE(b.current_valid, 0) current_valid
		FROM (
			SELECT
				r.player_id,
				SUM(r.amount) amount
			FROM (
				SELECT player_id, amount FROM "PaymentDepositRec"
				WHERE status = 10 AND created_at BETWEEN ${start} AND ${end}
				UNION
				SELECT player_id, amount FROM "BankDepositRec"
				WHERE status = 10 AND created_at BETWEEN ${start} AND ${end}
			) r
			GROUP BY player_id
		) d
		FULL JOIN (
			SELECT
				player_id,
				SUM(valid_amount) current_valid
			FROM "BetRecord"
			WHERE status = 10 AND bet_at BETWEEN ${start} AND ${end}
			GROUP BY player_id
		) b ON b.player_id = d.player_id
		RIGHT JOIN "Player" p ON p.id = d.player_id
		JOIN "Vip" v ON v.id = p.vip_id
	) m

	`;
};
