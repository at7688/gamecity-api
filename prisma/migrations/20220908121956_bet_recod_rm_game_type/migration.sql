/*
  Warnings:

  - You are about to drop the column `bet_type` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `game_type` on the `BetRecord` table. All the data in the column will be lost.
  - Added the required column `bet_target` to the `BetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetRecord" DROP COLUMN "bet_type",
DROP COLUMN "game_type",
ADD COLUMN     "bet_target" TEXT NOT NULL;
