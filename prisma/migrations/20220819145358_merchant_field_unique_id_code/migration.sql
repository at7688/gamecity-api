/*
  Warnings:

  - The primary key for the `MerchantField` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MerchantField` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[merchant_id,code]` on the table `MerchantField` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MerchantField" DROP CONSTRAINT "MerchantField_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "MerchantField_merchant_id_code_key" ON "MerchantField"("merchant_id", "code");
