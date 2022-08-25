/*
  Warnings:

  - You are about to drop the `BankWithdrawRec` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankWithdrawRec" DROP CONSTRAINT "BankWithdrawRec_player_card_id_fkey";

-- DropForeignKey
ALTER TABLE "BankWithdrawRec" DROP CONSTRAINT "BankWithdrawRec_player_id_fkey";

-- DropTable
DROP TABLE "BankWithdrawRec";

-- CreateTable
CREATE TABLE "WithdrawRec" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "player_card_id" TEXT NOT NULL,
    "inner_note" TEXT,
    "outter_note" TEXT,
    "withdraw_fee" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "WithdrawRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WithdrawRec" ADD CONSTRAINT "WithdrawRec_player_card_id_fkey" FOREIGN KEY ("player_card_id") REFERENCES "PlayerCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawRec" ADD CONSTRAINT "WithdrawRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
