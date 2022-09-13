/*
  Warnings:

  - The primary key for the `BetRatioRec` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BetRatioRec` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agent_id,bet_id]` on the table `BetRatioRec` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BetRatioRec" DROP CONSTRAINT "BetRatioRec_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "BetRatioRec_agent_id_bet_id_key" ON "BetRatioRec"("agent_id", "bet_id");
