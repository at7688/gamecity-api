/*
  Warnings:

  - Made the column `code` on table `PaymentMerchant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentMerchant" ALTER COLUMN "code" SET NOT NULL;
