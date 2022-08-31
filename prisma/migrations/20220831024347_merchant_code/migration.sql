/*
  Warnings:

  - Changed the type of `code` on the `PaymentMerchant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MerchantCode" AS ENUM ('QIYU', 'ECPAY');

-- AlterTable
ALTER TABLE "PaymentMerchant" DROP COLUMN "code",
ADD COLUMN     "code" "MerchantCode" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMerchant_code_key" ON "PaymentMerchant"("code");
