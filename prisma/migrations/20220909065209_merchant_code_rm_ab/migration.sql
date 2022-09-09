/*
  Warnings:

  - The values [AB] on the enum `MerchantCode` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MerchantCode_new" AS ENUM ('QIYU', 'ECPAY');
ALTER TABLE "PaymentMerchant" ALTER COLUMN "code" TYPE "MerchantCode_new" USING ("code"::text::"MerchantCode_new");
ALTER TABLE "MerchantLog" ALTER COLUMN "merchant_code" TYPE "MerchantCode_new" USING ("merchant_code"::text::"MerchantCode_new");
ALTER TYPE "MerchantCode" RENAME TO "MerchantCode_old";
ALTER TYPE "MerchantCode_new" RENAME TO "MerchantCode";
DROP TYPE "MerchantCode_old";
COMMIT;
