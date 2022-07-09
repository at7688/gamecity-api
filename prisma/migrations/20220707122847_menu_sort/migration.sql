-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "login_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "sort" SERIAL NOT NULL;
