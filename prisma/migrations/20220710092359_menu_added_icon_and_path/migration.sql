/*
  Warnings:

  - Made the column `nickname` on table `AdminUser` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "nickname" SET NOT NULL;

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "path" TEXT;
