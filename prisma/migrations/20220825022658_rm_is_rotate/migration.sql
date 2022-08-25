/*
  Warnings:

  - You are about to drop the column `is_rotate` on the `CompanyCard` table. All the data in the column will be lost.
  - You are about to drop the column `is_rotate` on the `PaymentTool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyCard" DROP COLUMN "is_rotate";

-- AlterTable
ALTER TABLE "PaymentTool" DROP COLUMN "is_rotate",
ADD COLUMN     "is_current" BOOLEAN NOT NULL DEFAULT true;
