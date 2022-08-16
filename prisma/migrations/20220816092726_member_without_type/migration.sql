/*
  Warnings:

  - You are about to drop the column `type` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "type";

-- DropEnum
DROP TYPE "InboxSendType";

-- DropEnum
DROP TYPE "MemberType";
