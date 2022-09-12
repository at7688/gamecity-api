/*
  Warnings:

  - You are about to drop the column `player_id` on the `GameRatio` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platform_code,game_code,agent_id]` on the table `GameRatio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agent_id` to the `GameRatio` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameRatio" DROP CONSTRAINT "GameRatio_player_id_fkey";

-- DropIndex
DROP INDEX "GameRatio_platform_code_game_code_player_id_key";

-- AlterTable
ALTER TABLE "GameRatio" DROP COLUMN "player_id",
ADD COLUMN     "agent_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GameRatio_platform_code_game_code_agent_id_key" ON "GameRatio"("platform_code", "game_code", "agent_id");

-- AddForeignKey
ALTER TABLE "GameRatio" ADD CONSTRAINT "GameRatio_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
