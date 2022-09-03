import { Prisma } from '@prisma/client';
import { SearchPaymentToolsDto } from '../dto/search-payment-tools.dto';
import { toolRecordSql } from './toolRecordSql';

export const getToolList = ({
  rotation_id,
  tool_name,
  merchant_id,
  merchant_no,
  is_active,
}: SearchPaymentToolsDto) => Prisma.sql`
${toolRecordSql()}

SELECT * FROM (
		SELECT
		t.tool_name,
		t.is_active,
		(merchant_config ::json->> 'merchant_no') merchant_no,
		m.name,
		m.code,
		t.is_current,
		w.payways,
		t.recharge_max,
		total_amount,
		total_count,
		current_amount,
		total_fee,
		total_player_fee,
		lastest_record
	FROM "PaymentTool" t
	JOIN "PaymentMerchant" m ON m.id = t.merchant_id
	JOIN (
		SELECT t.id, json_agg(p.*) payways FROM "PaymentTool" t
		JOIN "Payway" p ON p.tool_id = t.id
		GROUP BY t.id
	) w ON w.id = t.id
	JOIN (
		SELECT
			tool_id,
			SUM(amount) total_amount,
			COUNT(id) total_count,
			SUM(fee) total_fee,
			SUM(fee_on_player) total_player_fee
		FROM toolRecord
		GROUP BY tool_id
	) a ON a.tool_id = t.id
	LEFT JOIN (
		SELECT
			tool_id,
			SUM(amount) current_amount
		FROM toolRecord r
		WHERE created_at > accumulate_from
		GROUP BY tool_id
	) b ON b.tool_id = t.id
	LEFT JOIN (
		SELECT DISTINCT ON (tool_id)
		tool_id, json_build_object(
			'created_at', created_at,
			'amount', amount
		) lastest_record FROM (
			SELECT *
			FROM toolRecord
			ORDER BY created_at DESC
		) k
	) r ON r.tool_id = t.id
) m
WHERE
${Prisma.sql`merchant_no LIKE '%' || ${merchant_no} || '%'`} AND
${Prisma.sql`tool_name LIKE '%' || ${tool_name} || '%'`}
`;
