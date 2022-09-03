import { PaymentTool, Prisma } from '@prisma/client';
import { toolRecordSql } from './toolRecordSql';

export type ValidTool = PaymentTool & { current_amount: number };

export const validTools = ({
  rotation_id,
  tool_id,
}: {
  rotation_id?: number;
  tool_id?: string;
}) => Prisma.sql`
${toolRecordSql()}
SELECT * FROM
(
	SELECT t.*, COALESCE(r.sum, 0) current_amount  FROM "PaymentTool" t
	JOIN (
		SELECT
			tool_id,
			SUM(amount)
		FROM toolRecord r
		WHERE r.created_at > accumulate_from
		GROUP BY tool_id
	) r ON r.tool_id = t.id
) list
WHERE is_active
  AND recharge_max > current_amount
  ${rotation_id ? Prisma.sql`AND rotation_id = ${rotation_id}` : Prisma.empty}
  ${tool_id ? Prisma.sql`AND id = ${tool_id}` : Prisma.empty}
`;