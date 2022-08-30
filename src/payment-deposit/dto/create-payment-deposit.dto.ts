import { Prisma } from '@prisma/client';

export class CreatePaymentDepositDto {
  amount: number;
  payway_id: string;
  // player: Prisma.PlayerCreateNestedOneWithoutPayment_depositsInput;
  // fee_on_player: number;
  // fee_on_company: number;
  // merchant: Prisma.PaymentMerchantCreateNestedOneWithoutRecordsInput;
  // bill?: Prisma.MerchantBillCreateNestedOneWithoutRecordInput;
  // status?: number;
}
