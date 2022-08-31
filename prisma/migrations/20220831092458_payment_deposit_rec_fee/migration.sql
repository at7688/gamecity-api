/*
  Warnings:

  - You are about to drop the column `fee_on_company` on the `PaymentDepositRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentDepositRec" DROP COLUMN "fee_on_company",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0;
