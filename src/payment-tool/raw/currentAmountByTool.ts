import { Prisma } from '@prisma/client';
import { toolRecordSql } from './toolRecordSql';

export interface ToolCurrentAmount {
  id: string;
  current_amount: number;
}
export const currentAmountByTool = () => Prisma.sql`
${toolRecordSql()}
SELECT t.id, COALESCE(r.sum, 0) current_amount  FROM "PaymentTool" t
JOIN (
	SELECT
		tool_id,
		SUM(amount)
	FROM toolRecord r
  WHERE r.created_at > accumulate_from
	GROUP BY tool_id
) r ON r.tool_id = t.id
`;
