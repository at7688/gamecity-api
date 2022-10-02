/*
  Warnings:

  - You are about to drop the column `target_type` on the `Maintenance` table. All the data in the column will be lost.
  - Added the required column `type` to the `Maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "target_type",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "type" INTEGER NOT NULL;
