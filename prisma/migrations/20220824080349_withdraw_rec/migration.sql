/*
  Warnings:

  - You are about to drop the column `note` on the `BankDepositRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" DROP COLUMN "note",
ADD COLUMN     "inner_note" TEXT,
ADD COLUMN     "outter_note" TEXT;

-- CreateTable
CREATE TABLE "BankWithdrawRec" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "card_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "player_card_id" TEXT NOT NULL,
    "inner_note" TEXT,
    "outter_note" TEXT,
    "withdraw_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "BankWithdrawRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankWithdrawRec" ADD CONSTRAINT "BankWithdrawRec_player_card_id_fkey" FOREIGN KEY ("player_card_id") REFERENCES "PlayerCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankWithdrawRec" ADD CONSTRAINT "BankWithdrawRec_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "CompanyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankWithdrawRec" ADD CONSTRAINT "BankWithdrawRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
