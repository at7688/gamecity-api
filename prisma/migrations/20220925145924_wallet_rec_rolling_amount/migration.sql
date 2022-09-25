/*
  Warnings:

  - You are about to drop the column `rolling_demand` on the `WalletRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WalletRec" DROP COLUMN "rolling_demand",
ADD COLUMN     "rolling_amount" INTEGER;
