/*
  Warnings:

  - You are about to drop the column `apply_gap` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" ADD COLUMN     "is_first" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PaymentDepositRec" ADD COLUMN     "is_first" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "apply_gap";
