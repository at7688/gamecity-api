-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "is_blocked" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "is_blocked" BOOLEAN NOT NULL DEFAULT false;
