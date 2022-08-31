/*
  Warnings:

  - You are about to drop the column `trade_no` on the `PaymentDepositRec` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[record_id]` on the table `MerchantOrder` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `record_id` to the `MerchantOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentDepositRec" DROP CONSTRAINT "PaymentDepositRec_trade_no_fkey";

-- DropIndex
DROP INDEX "PaymentDepositRec_trade_no_key";

-- AlterTable
ALTER TABLE "MerchantOrder" ADD COLUMN     "record_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentDepositRec" DROP COLUMN "trade_no";

-- CreateIndex
CREATE UNIQUE INDEX "MerchantOrder_record_id_key" ON "MerchantOrder"("record_id");

-- AddForeignKey
ALTER TABLE "MerchantOrder" ADD CONSTRAINT "MerchantOrder_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "PaymentDepositRec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
