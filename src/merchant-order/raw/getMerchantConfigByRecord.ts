import { Prisma } from '@prisma/client';
export const getMerchantConfigByRecord = (record_id: string) => Prisma.sql`
SELECT t.merchant_config FROM "PaymentDepositRec" r
JOIN "Payway" p ON p.id = r.payway_id
JOIN "PaymentTool" t ON t.id = p.tool_id
WHERE r.id = ${record_id}
`;
