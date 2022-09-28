/*
  Warnings:

  - Made the column `parent_id` on table `PromoCode` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PromoCode" DROP CONSTRAINT "PromoCode_parent_id_fkey";

-- AlterTable
ALTER TABLE "PromoCode" ALTER COLUMN "parent_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
