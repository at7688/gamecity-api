/*
  Warnings:

  - You are about to drop the column `job_ids` on the `Maintenance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "job_ids",
ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;
