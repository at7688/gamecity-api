/*
  Warnings:

  - You are about to drop the column `max` on the `CompanyCard` table. All the data in the column will be lost.
  - You are about to drop the column `min` on the `CompanyCard` table. All the data in the column will be lost.
  - You are about to drop the column `total_max` on the `CompanyCard` table. All the data in the column will be lost.
  - Added the required column `deposit_max` to the `CompanyCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deposit_min` to the `CompanyCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recharge_max` to the `CompanyCard` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PayWayType" AS ENUM ('CVS', 'BARCODE', 'CREDIT', 'ATM');

-- AlterTable
ALTER TABLE "CompanyCard" DROP COLUMN "max",
DROP COLUMN "min",
DROP COLUMN "total_max",
ADD COLUMN     "deposit_max" INTEGER NOT NULL,
ADD COLUMN     "deposit_min" INTEGER NOT NULL,
ADD COLUMN     "recharge_max" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Payway" (
    "id" TEXT NOT NULL,
    "type" "PayWayType" NOT NULL,
    "code" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "per_deposit_min" INTEGER NOT NULL,
    "per_deposit_max" INTEGER NOT NULL,
    "player_fee_amount" DOUBLE PRECISION NOT NULL,
    "player_fee_percent" DOUBLE PRECISION NOT NULL,
    "player_fee_min" DOUBLE PRECISION NOT NULL,
    "player_fee_max" DOUBLE PRECISION NOT NULL,
    "fee_amount" DOUBLE PRECISION NOT NULL,
    "fee_percent" DOUBLE PRECISION NOT NULL,
    "fee_min" DOUBLE PRECISION NOT NULL,
    "fee_max" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantField" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,

    CONSTRAINT "MerchantField_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "PaymentMerchant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "PaymentMerchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTool" (
    "id" TEXT NOT NULL,
    "tool_name" TEXT NOT NULL,
    "rotation_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "deposit_min" INTEGER NOT NULL,
    "deposit_max" INTEGER NOT NULL,
    "recharge_max" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "PaymentTool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payway" ADD CONSTRAINT "Payway_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantField" ADD CONSTRAINT "MerchantField_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "PaymentMerchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTool" ADD CONSTRAINT "PaymentTool_rotation_id_fkey" FOREIGN KEY ("rotation_id") REFERENCES "RotationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
