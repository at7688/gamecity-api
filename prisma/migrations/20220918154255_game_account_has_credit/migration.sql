/*
  Warnings:

  - You are about to drop the column `has_credit` on the `GamePlatform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameAccount" ADD COLUMN     "has_credit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "has_credit";
