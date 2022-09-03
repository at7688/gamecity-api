import { Prisma } from '@prisma/client';

export const getCurrentPayways = (vip_id: string) => Prisma.sql`
SELECT * FROM "Payway"
WHERE tool_id IN (
	SELECT t.id FROM "RotationGroup" g
	JOIN "PaymentTool" t ON t.rotation_id = g.id
	JOIN "Vip" v ON v.payment_rotate_id = g.id
	WHERE v.id = ${vip_id} AND is_current
) AND is_active
`;
