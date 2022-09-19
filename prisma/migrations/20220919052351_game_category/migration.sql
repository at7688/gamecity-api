/*
  Warnings:

  - You are about to drop the column `category_code` on the `GamePlatform` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BetRecord" DROP CONSTRAINT "BetRecord_platform_code_category_code_fkey";

-- DropForeignKey
ALTER TABLE "GamePlatform" DROP CONSTRAINT "GamePlatform_category_code_fkey";

-- DropIndex
DROP INDEX "GamePlatform_code_category_code_key";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "category_code" TEXT;

-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "category_code";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_category_code_fkey" FOREIGN KEY ("category_code") REFERENCES "GameCategory"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetRecord" ADD CONSTRAINT "BetRecord_platform_code_fkey" FOREIGN KEY ("platform_code") REFERENCES "GamePlatform"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
