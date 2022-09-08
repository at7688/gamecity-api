/*
  Warnings:

  - The primary key for the `BetRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `betNo` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeRate` on the `GamePlatform` table. All the data in the column will be lost.
  - Added the required column `bet_no` to the `BetRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `game_code` to the `BetRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform_code` to the `BetRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetRecord" DROP CONSTRAINT "BetRecord_pkey",
DROP COLUMN "betNo",
ADD COLUMN     "bet_no" TEXT NOT NULL,
ADD COLUMN     "game_code" TEXT NOT NULL,
ADD COLUMN     "platform_code" TEXT NOT NULL,
ADD CONSTRAINT "BetRecord_pkey" PRIMARY KEY ("bet_no");

-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "exchangeRate",
ADD COLUMN     "exchange_rate" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "BetRecord" ADD CONSTRAINT "BetRecord_platform_code_fkey" FOREIGN KEY ("platform_code") REFERENCES "GamePlatform"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetRecord" ADD CONSTRAINT "BetRecord_game_code_platform_code_fkey" FOREIGN KEY ("game_code", "platform_code") REFERENCES "Game"("code", "platform_code") ON DELETE RESTRICT ON UPDATE CASCADE;
