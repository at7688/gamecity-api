/*
  Warnings:

  - You are about to drop the `MerchantOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trans_id]` on the table `PaymentDepositRec` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MerchantOrder" DROP CONSTRAINT "MerchantOrder_merchant_id_fkey";

-- DropForeignKey
ALTER TABLE "MerchantOrder" DROP CONSTRAINT "MerchantOrder_record_id_fkey";

-- AlterTable
ALTER TABLE "PaymentDepositRec" ADD COLUMN     "bank_account" TEXT,
ADD COLUMN     "bank_code" TEXT,
ADD COLUMN     "extra" JSONB,
ADD COLUMN     "notify_info" JSONB,
ADD COLUMN     "pay_code" TEXT,
ADD COLUMN     "trans_id" TEXT;

-- DropTable
DROP TABLE "MerchantOrder";

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDepositRec_trans_id_key" ON "PaymentDepositRec"("trans_id");
