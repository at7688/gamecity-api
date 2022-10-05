/*
  Warnings:

  - You are about to drop the column `withdraw_nums` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" ALTER COLUMN "is_first" DROP NOT NULL,
ALTER COLUMN "is_first" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PaymentDepositRec" ALTER COLUMN "is_first" DROP NOT NULL,
ALTER COLUMN "is_first" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "withdraw_nums";

-- AlterTable
ALTER TABLE "PlayerTag" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1;
