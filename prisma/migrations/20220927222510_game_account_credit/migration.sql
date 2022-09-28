/*
  Warnings:

  - You are about to drop the column `has_credit` on the `GameAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameAccount" DROP COLUMN "has_credit",
ADD COLUMN     "credit" DOUBLE PRECISION NOT NULL DEFAULT 0;
