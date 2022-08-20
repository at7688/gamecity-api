/*
  Warnings:

  - Made the column `merchant_id` on table `PaymentTool` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PaymentTool" DROP CONSTRAINT "PaymentTool_merchant_id_fkey";

-- AlterTable
ALTER TABLE "PaymentTool" ALTER COLUMN "merchant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PaymentTool" ADD CONSTRAINT "PaymentTool_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
