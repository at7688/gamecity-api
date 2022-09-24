-- AlterTable
ALTER TABLE "BankDepositRec" ADD COLUMN     "promotion_id" TEXT;

-- AlterTable
ALTER TABLE "PaymentDepositRec" ADD COLUMN     "promotion_id" TEXT;

-- AddForeignKey
ALTER TABLE "BankDepositRec" ADD CONSTRAINT "BankDepositRec_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
