-- AlterTable
ALTER TABLE "LoginRec" ADD COLUMN     "nums_failed" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "is_blocked" DROP DEFAULT;
