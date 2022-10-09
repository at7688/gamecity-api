/*
  Warnings:

  - Made the column `start_at` on table `Promotion` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_at` on table `Promotion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "start_at" SET NOT NULL,
ALTER COLUMN "end_at" SET NOT NULL;
