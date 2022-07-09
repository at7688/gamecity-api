/*
  Warnings:

  - The values [Player,Agent] on the enum `MemberType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MemberType_new" AS ENUM ('PLAYER', 'AGENT');
ALTER TABLE "Member" ALTER COLUMN "type" TYPE "MemberType_new" USING ("type"::text::"MemberType_new");
ALTER TYPE "MemberType" RENAME TO "MemberType_old";
ALTER TYPE "MemberType_new" RENAME TO "MemberType";
DROP TYPE "MemberType_old";
COMMIT;
