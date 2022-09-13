/*
  Warnings:

  - Made the column `category_code` on table `BetRecord` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BetRecord" DROP CONSTRAINT "BetRecord_platform_code_fkey";

-- AlterTable
ALTER TABLE "BetRecord" ALTER COLUMN "category_code" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "BetRecord" ADD CONSTRAINT "BetRecord_platform_code_category_code_fkey" FOREIGN KEY ("platform_code", "category_code") REFERENCES "GamePlatform"("code", "category_code") ON DELETE RESTRICT ON UPDATE CASCADE;
