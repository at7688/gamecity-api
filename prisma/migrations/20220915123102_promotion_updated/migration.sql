/*
  Warnings:

  - You are about to drop the column `auto_apply_schedule` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `auto_pay_schedule` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "auto_apply_schedule",
DROP COLUMN "auto_pay_schedule",
ADD COLUMN     "rolling_type" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "schedule_type" INTEGER NOT NULL DEFAULT 1;
