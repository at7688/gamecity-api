/*
  Warnings:

  - You are about to drop the column `deposit_max` on the `PaymentTool` table. All the data in the column will be lost.
  - You are about to drop the column `deposit_min` on the `PaymentTool` table. All the data in the column will be lost.
  - You are about to drop the column `merchant_id` on the `Payway` table. All the data in the column will be lost.
  - You are about to drop the column `per_deposit_max` on the `Payway` table. All the data in the column will be lost.
  - You are about to drop the column `per_deposit_min` on the `Payway` table. All the data in the column will be lost.
  - Added the required column `deposit_max` to the `Payway` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deposit_min` to the `Payway` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payway" DROP CONSTRAINT "Payway_merchant_id_fkey";

-- AlterTable
ALTER TABLE "PaymentMerchant" ADD COLUMN     "payway_types" "PayWayType"[];

-- AlterTable
ALTER TABLE "PaymentTool" DROP COLUMN "deposit_max",
DROP COLUMN "deposit_min";

-- AlterTable
ALTER TABLE "Payway" DROP COLUMN "merchant_id",
DROP COLUMN "per_deposit_max",
DROP COLUMN "per_deposit_min",
ADD COLUMN     "deposit_max" INTEGER NOT NULL,
ADD COLUMN     "deposit_min" INTEGER NOT NULL;
