/*
  Warnings:

  - Made the column `merchant_id` on table `Payway` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payway" DROP CONSTRAINT "Payway_merchant_id_fkey";

-- AlterTable
ALTER TABLE "Payway" ALTER COLUMN "merchant_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payway" ADD CONSTRAINT "Payway_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
