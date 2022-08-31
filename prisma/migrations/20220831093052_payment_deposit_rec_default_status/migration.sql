/*
  Warnings:

  - Made the column `status` on table `PaymentDepositRec` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentDepositRec" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 1;
