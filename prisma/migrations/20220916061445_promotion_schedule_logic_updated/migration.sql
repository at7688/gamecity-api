/*
  Warnings:

  - You are about to drop the column `applicants_limit_type` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `apply_limit_type` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "applicants_limit_type",
DROP COLUMN "apply_limit_type",
ADD COLUMN     "apply_gap" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "settlement_type" INTEGER NOT NULL DEFAULT 1;
