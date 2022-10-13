/*
  Warnings:

  - Made the column `name` on table `Payway` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payway" DROP CONSTRAINT "Payway_tool_id_fkey";

-- AlterTable
ALTER TABLE "Payway" ADD COLUMN     "merchant_id" TEXT,
ALTER COLUMN "tool_id" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Payway" ADD CONSTRAINT "Payway_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payway" ADD CONSTRAINT "Payway_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "PaymentTool"("id") ON DELETE SET NULL ON UPDATE CASCADE;
