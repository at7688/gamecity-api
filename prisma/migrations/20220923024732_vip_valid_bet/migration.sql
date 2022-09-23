/*
  Warnings:

  - You are about to drop the column `ebet_min` on the `Vip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vip" DROP COLUMN "ebet_min",
ADD COLUMN     "valid_bet" INTEGER NOT NULL DEFAULT 0;
