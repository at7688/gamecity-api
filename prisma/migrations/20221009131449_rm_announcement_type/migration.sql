/*
  Warnings:

  - The `type` column on the `Announcement` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1;

-- DropEnum
DROP TYPE "AnnouncementType";
