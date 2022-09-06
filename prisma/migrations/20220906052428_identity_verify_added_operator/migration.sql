-- AlterTable
ALTER TABLE "IdentityVerify" ADD COLUMN     "operator_id" TEXT;

-- AddForeignKey
ALTER TABLE "IdentityVerify" ADD CONSTRAINT "IdentityVerify_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
