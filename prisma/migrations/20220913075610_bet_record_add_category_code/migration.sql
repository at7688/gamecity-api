/*
  Warnings:

  - A unique constraint covering the columns `[code,category_code]` on the table `GamePlatform` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BetRecord" ADD COLUMN     "category_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "GamePlatform_code_category_code_key" ON "GamePlatform"("code", "category_code");
