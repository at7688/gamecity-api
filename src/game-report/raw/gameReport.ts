import { Prisma } from '@prisma/client';
import { SearchGameReportsDto } from '../dto/search-game-reports.dto';

export const gameReport = (
  groupBy: string,
  {
    category_codes,
    game_ids,
    username,
    agent_username,
    bet_start_at,
    bet_end_at,
  }: SearchGameReportsDto,
) => {
  console.log({
    groupBy,
    category_codes,
    game_ids,
    username,
    agent_username,
    bet_start_at,
    bet_end_at,
  });
  return Prisma.sql`
  WITH filteredBetRecord AS (
    SELECT
      r.*,
      c.name category_name,
      c.code category_code,
      p.name platform_name
    FROM "BetRecord" r
      JOIN "Player" l ON l.id = r.player_id
      JOIN "Game" g ON g.code = r.game_code
      JOIN "GamePlatform" p ON p.code = r.platform_code
      JOIN "GameCategory" c ON c.code = p.category_code
    WHERE


      ${game_ids ? `AND g.id IN (${Prisma.join(game_ids)})` : Prisma.empty}
      ${
        category_codes
          ? `AND c.code IN (${Prisma.join(category_codes)})`
          : Prisma.empty
      }
  )

  SELECT
    r.*
  FROM (
    SELECT
      platform_code,
      COUNT(*) bet_count,
      SUM(amount::NUMERIC(30,2)) bet_amount,
      COALESCE(SUM(valid_amount)::NUMERIC(30,2), 0) valid_amount,
      SUM(win_lose_amount::NUMERIC(30,2)) win_lose_amount
    FROM filteredBetRecord
    GROUP BY platform_code
  ) r
  `;
};
