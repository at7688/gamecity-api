/*
  Warnings:

  - You are about to drop the column `code` on the `Game` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Game_code_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "code";
