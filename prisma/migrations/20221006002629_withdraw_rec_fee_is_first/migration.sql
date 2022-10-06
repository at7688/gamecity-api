/*
  Warnings:

  - You are about to drop the column `withdraw_fee` on the `WithdrawRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WithdrawRec" DROP COLUMN "withdraw_fee",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "is_first" BOOLEAN;
