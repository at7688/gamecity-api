-- DropForeignKey
ALTER TABLE "PaymentDepositRec" DROP CONSTRAINT "PaymentDepositRec_trade_no_fkey";

-- AlterTable
ALTER TABLE "PaymentDepositRec" ALTER COLUMN "fee_on_company" SET DEFAULT 0,
ALTER COLUMN "fee_on_player" SET DEFAULT 0,
ALTER COLUMN "trade_no" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_trade_no_fkey" FOREIGN KEY ("trade_no") REFERENCES "MerchantBill"("trade_no") ON DELETE SET NULL ON UPDATE CASCADE;
