/*
  Warnings:

  - You are about to drop the column `is_blocked` on the `LoginRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "LoginRec" DROP COLUMN "is_blocked",
ADD COLUMN     "failed_msg" TEXT;
