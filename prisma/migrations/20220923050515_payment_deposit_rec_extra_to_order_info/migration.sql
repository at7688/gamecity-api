/*
  Warnings:

  - You are about to drop the column `extra` on the `PaymentDepositRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentDepositRec" DROP COLUMN "extra",
ADD COLUMN     "order_info" JSONB;
