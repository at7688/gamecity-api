/*
  Warnings:

  - The primary key for the `MerchantField` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MerchantField" DROP CONSTRAINT "MerchantField_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MerchantField_pkey" PRIMARY KEY ("id");
