/*
  Warnings:

  - You are about to drop the column `acc_tail` on the `BankDepositRec` table. All the data in the column will be lost.
  - Added the required column `player_card_id` to the `BankDepositRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" DROP COLUMN "acc_tail",
ADD COLUMN     "player_card_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BankDepositRec" ADD CONSTRAINT "BankDepositRec_player_card_id_fkey" FOREIGN KEY ("player_card_id") REFERENCES "PlayerCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
