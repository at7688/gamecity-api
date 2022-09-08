/*
  Warnings:

  - Added the required column `player_id` to the `BetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetRecord" ADD COLUMN     "player_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "BetRecord" ADD CONSTRAINT "BetRecord_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
