/*
  Warnings:

  - A unique constraint covering the columns `[bet_no,trade_no]` on the table `BetRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trade_no` to the `BetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetRecord" ADD COLUMN     "trade_no" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BetRecord_bet_no_trade_no_key" ON "BetRecord"("bet_no", "trade_no");
