/*
  Warnings:

  - You are about to drop the column `current_recharge` on the `PaymentTool` table. All the data in the column will be lost.
  - You are about to drop the column `total_count` on the `PaymentTool` table. All the data in the column will be lost.
  - You are about to drop the column `total_recharge` on the `PaymentTool` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentTool" DROP COLUMN "current_recharge",
DROP COLUMN "total_count",
DROP COLUMN "total_recharge",
ADD COLUMN     "accumulate_from" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
