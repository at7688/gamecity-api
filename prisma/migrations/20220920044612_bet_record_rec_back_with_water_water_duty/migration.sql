/*
  Warnings:

  - You are about to drop the column `ratios` on the `BetRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BetRecord" DROP COLUMN "ratios";

-- CreateTable
CREATE TABLE "BetRatioRec" (
    "agent_id" TEXT NOT NULL,
    "bet_id" TEXT NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,
    "water" DOUBLE PRECISION NOT NULL,
    "water_duty" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BetRatioRec_agent_id_bet_id_key" ON "BetRatioRec"("agent_id", "bet_id");

-- AddForeignKey
ALTER TABLE "BetRatioRec" ADD CONSTRAINT "BetRatioRec_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetRatioRec" ADD CONSTRAINT "BetRatioRec_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "BetRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
