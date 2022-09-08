/*
  Warnings:

  - The primary key for the `BetRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `trade_no` column on the `BetRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[bet_no,platform_code]` on the table `BetRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `BetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BetRecord_bet_no_trade_no_key";

-- AlterTable
ALTER TABLE "BetRecord" DROP CONSTRAINT "BetRecord_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
DROP COLUMN "trade_no",
ADD COLUMN     "trade_no" TEXT[],
ADD CONSTRAINT "BetRecord_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "BetRecord_bet_no_platform_code_key" ON "BetRecord"("bet_no", "platform_code");
