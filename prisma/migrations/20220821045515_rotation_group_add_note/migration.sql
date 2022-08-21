/*
  Warnings:

  - Made the column `accumulate_from` on table `CompanyCard` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "CompanyCard" ALTER COLUMN "accumulate_from" SET NOT NULL,
ALTER COLUMN "accumulate_from" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RotationGroup" ADD COLUMN     "note" TEXT;
