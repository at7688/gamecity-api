/*
  Warnings:

  - You are about to drop the column `apply_approval_type` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `pay_approval_type` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "apply_approval_type",
DROP COLUMN "pay_approval_type",
ADD COLUMN     "approval_type" INTEGER NOT NULL DEFAULT 1;
