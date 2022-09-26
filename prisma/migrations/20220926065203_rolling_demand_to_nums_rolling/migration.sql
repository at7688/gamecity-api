/*
  Warnings:

  - You are about to drop the column `rolling_demand` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `rolling_demand` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `rolling_demand` on the `TransferRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BetRecord" ADD COLUMN     "nums_rolling" DOUBLE PRECISION NOT NULL DEFAULT 1,
ADD COLUMN     "rolling_amount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "rolling_demand",
ADD COLUMN     "nums_rolling" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "rolling_demand",
ADD COLUMN     "nums_rolling" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "TransferRec" DROP COLUMN "rolling_demand",
ADD COLUMN     "nums_rolling" DOUBLE PRECISION NOT NULL DEFAULT 1;
