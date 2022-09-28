/*
  Warnings:

  - You are about to drop the column `deposite_min` on the `Vip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vip" DROP COLUMN "deposite_min",
ADD COLUMN     "deposit_min" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sort" SERIAL NOT NULL;
