/*
  Warnings:

  - The values [MEMBERS] on the enum `InboxSendType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InboxSendType_new" AS ENUM ('PRIVATE', 'AGENTS', 'PLAYERS', 'SYSTEM');
ALTER TABLE "InboxRec" ALTER COLUMN "inbox_type" TYPE "InboxSendType_new" USING ("inbox_type"::text::"InboxSendType_new");
ALTER TYPE "InboxSendType" RENAME TO "InboxSendType_old";
ALTER TYPE "InboxSendType_new" RENAME TO "InboxSendType";
DROP TYPE "InboxSendType_old";
COMMIT;
