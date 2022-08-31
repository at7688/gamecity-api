import { Prisma } from '@prisma/client';

export const getMerchantByPayway = (payment_id: string) => Prisma.sql`
SELECT
      p.type pay_type,
      p.code payway_code,
      m.id merchant_id,
      m.code merchant_code,
      t.merchant_config config
FROM "Payway" p
JOIN "PaymentTool" t ON t.id = p.tool_id
JOIN "PaymentMerchant" m ON m.id = t.merchant_id
WHERE p.id = ${payment_id}
`;
