/*
  Warnings:

  - Changed the type of `merchant_code` on the `MerchantLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MerchantLog" DROP COLUMN "merchant_code",
ADD COLUMN     "merchant_code" TEXT NOT NULL;
