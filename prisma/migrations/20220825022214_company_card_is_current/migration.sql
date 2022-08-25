-- AlterTable
ALTER TABLE "CompanyCard" ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "is_active" SET DEFAULT false;
