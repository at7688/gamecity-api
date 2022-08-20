/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `PaymentMerchant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentMerchant" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMerchant_code_key" ON "PaymentMerchant"("code");
