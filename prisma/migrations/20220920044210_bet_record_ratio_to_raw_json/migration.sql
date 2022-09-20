/*
  Warnings:

  - You are about to drop the `BetRatioRec` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BetRatioRec" DROP CONSTRAINT "BetRatioRec_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "BetRatioRec" DROP CONSTRAINT "BetRatioRec_bet_id_fkey";

-- AlterTable
ALTER TABLE "BetRecord" ADD COLUMN     "ratios" JSONB;

-- DropTable
DROP TABLE "BetRatioRec";
