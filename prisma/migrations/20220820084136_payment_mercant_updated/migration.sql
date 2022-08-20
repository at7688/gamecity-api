/*
  Warnings:

  - You are about to drop the column `merchant_trade_no` on the `PaymentDepositRec` table. All the data in the column will be lost.
  - You are about to drop the column `payway_types` on the `PaymentMerchant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trade_no]` on the table `PaymentDepositRec` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fee_on_company` to the `PaymentDepositRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee_on_player` to the `PaymentDepositRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_id` to the `PaymentDepositRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trade_no` to the `PaymentDepositRec` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Payway` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PayType" AS ENUM ('CVS', 'BARCODE', 'CREDIT', 'ATM');

-- AlterTable
ALTER TABLE "CompanyCard" ADD COLUMN     "is_rotate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "PaymentDepositRec" DROP COLUMN "merchant_trade_no",
ADD COLUMN     "fee_on_company" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fee_on_player" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "merchant_id" TEXT NOT NULL,
ADD COLUMN     "status" INTEGER,
ADD COLUMN     "trade_no" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaymentMerchant" DROP COLUMN "payway_types",
ADD COLUMN     "pay_types" "PayType"[];

-- AlterTable
ALTER TABLE "PaymentTool" ADD COLUMN     "is_rotate" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sort" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Payway" DROP COLUMN "type",
ADD COLUMN     "type" "PayType" NOT NULL;

-- AlterTable
CREATE SEQUENCE "rotationgroup_sort_seq";
ALTER TABLE "RotationGroup" ALTER COLUMN "sort" SET DEFAULT nextval('rotationgroup_sort_seq');
ALTER SEQUENCE "rotationgroup_sort_seq" OWNED BY "RotationGroup"."sort";

-- DropEnum
DROP TYPE "PayWayType";

-- CreateTable
CREATE TABLE "MerchantBill" (
    "trade_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3),
    "paid_at" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "status" INTEGER NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "pay_type" "PayType" NOT NULL,
    "pay_code" TEXT,
    "bank_code" TEXT,
    "bank_account" TEXT,

    CONSTRAINT "MerchantBill_pkey" PRIMARY KEY ("trade_no")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDepositRec_trade_no_key" ON "PaymentDepositRec"("trade_no");

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_trade_no_fkey" FOREIGN KEY ("trade_no") REFERENCES "MerchantBill"("trade_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantBill" ADD CONSTRAINT "MerchantBill_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
