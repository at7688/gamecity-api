import { Prisma } from '@prisma/client';
import { SearchGameReportsDto } from '../dto/search-game-reports.dto';

export const gameReport = (search: SearchGameReportsDto) => {
  const { bet_start_at, bet_end_at, group_by } = search;
  return Prisma.sql`
  SELECT
    g.*
  FROM (
    SELECT
      ${
        group_by === 'platform_code'
          ? Prisma.sql`platform_code`
          : Prisma.sql`category_code`
      },
      COUNT(*) count,
      SUM(amount) amount,
      SUM(valid_amount) valid_amount,
      SUM(win_lose_amount)::decimal(65,2) win_lose_amount,
      SUM(valid_amount * vip_water / 100)::decimal(65,2) vip_water,
      SUM(valid_amount * promotion_water / 100)::decimal(65,2) promotion_water,
      SUM(valid_amount * agent_water / 100)::decimal(65,2) agent_water
    FROM "BetRecord"
  	WHERE bet_at BETWEEN ${bet_start_at} AND ${bet_end_at}
    ${
      group_by === 'platform_code'
        ? Prisma.sql`GROUP BY platform_code`
        : Prisma.sql`GROUP BY category_code`
    }

  ) g

  `;
};
