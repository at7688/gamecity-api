/*
  Warnings:

  - Made the column `channel` on table `MerchantOrder` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MerchantOrder" ALTER COLUMN "channel" SET NOT NULL;

-- AlterTable
ALTER TABLE "PaymentTool" ADD COLUMN     "current_recharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_recharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "recharge_max" SET DEFAULT 0;
