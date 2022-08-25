/*
  Warnings:

  - You are about to drop the column `card_id` on the `BankWithdrawRec` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankWithdrawRec" DROP CONSTRAINT "BankWithdrawRec_card_id_fkey";

-- AlterTable
ALTER TABLE "BankWithdrawRec" DROP COLUMN "card_id";
