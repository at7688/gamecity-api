-- AlterTable
ALTER TABLE "PaymentTool" ADD COLUMN     "merchant_id" TEXT;

-- AddForeignKey
ALTER TABLE "PaymentTool" ADD CONSTRAINT "PaymentTool_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
