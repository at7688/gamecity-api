/*
  Warnings:

  - You are about to drop the column `pay_types` on the `PaymentMerchant` table. All the data in the column will be lost.
  - You are about to drop the `MerchantField` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MerchantField" DROP CONSTRAINT "MerchantField_merchant_id_fkey";

-- AlterTable
ALTER TABLE "PaymentMerchant" DROP COLUMN "pay_types",
ADD COLUMN     "config" JSONB;

-- DropTable
DROP TABLE "MerchantField";
