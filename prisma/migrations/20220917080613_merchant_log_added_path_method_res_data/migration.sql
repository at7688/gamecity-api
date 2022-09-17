/*
  Warnings:

  - You are about to drop the column `data` on the `MerchantLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MerchantLog" DROP COLUMN "data",
ADD COLUMN     "method" TEXT,
ADD COLUMN     "path" TEXT,
ADD COLUMN     "resData" JSONB,
ADD COLUMN     "sendData" JSONB;
