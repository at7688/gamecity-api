/*
  Warnings:

  - You are about to drop the column `apply_approval_rule` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `pay_approval_rule` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "apply_approval_rule",
DROP COLUMN "pay_approval_rule",
ADD COLUMN     "apply_approval_type" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "pay_approval_type" INTEGER NOT NULL DEFAULT 1;
