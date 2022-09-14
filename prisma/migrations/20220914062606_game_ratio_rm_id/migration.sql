/*
  Warnings:

  - The primary key for the `GameRatio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GameRatio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameRatio" DROP CONSTRAINT "GameRatio_pkey",
DROP COLUMN "id";
