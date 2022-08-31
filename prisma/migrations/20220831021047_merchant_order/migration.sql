/*
  Warnings:

  - You are about to drop the `MerchantBill` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MerchantBill" DROP CONSTRAINT "MerchantBill_merchant_id_fkey";

-- DropForeignKey
ALTER TABLE "PaymentDepositRec" DROP CONSTRAINT "PaymentDepositRec_trade_no_fkey";

-- DropTable
DROP TABLE "MerchantBill";

-- CreateTable
CREATE TABLE "MerchantOrder" (
    "trade_no" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMPTZ,
    "paid_at" TIMESTAMPTZ,
    "price" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "pay_type" "PayType" NOT NULL,
    "pay_code" TEXT,
    "bank_code" TEXT,
    "bank_account" TEXT,

    CONSTRAINT "MerchantOrder_pkey" PRIMARY KEY ("trade_no")
);

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_trade_no_fkey" FOREIGN KEY ("trade_no") REFERENCES "MerchantOrder"("trade_no") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantOrder" ADD CONSTRAINT "MerchantOrder_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
