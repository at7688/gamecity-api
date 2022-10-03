/*
  Warnings:

  - You are about to drop the column `info` on the `SmsMerchant` table. All the data in the column will be lost.
  - Added the required column `config` to the `SmsMerchant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SmsMerchant" DROP COLUMN "info",
ADD COLUMN     "config" JSONB NOT NULL;
