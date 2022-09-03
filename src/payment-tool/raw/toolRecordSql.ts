import { Prisma } from '@prisma/client';

export const toolRecordSql = () => Prisma.sql`
WITH toolRecord AS (
	SELECT
		t.id tool_id,
		t.accumulate_from,
		r.*
	FROM "PaymentDepositRec" r
	JOIN "Payway" p ON p.id = r.payway_id
	RIGHT JOIN "PaymentTool" t ON t.id = p.tool_id
	ORDER BY created_at DESC
)
`;
