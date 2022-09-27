/*
  Warnings:

  - You are about to drop the column `origin_amount` on the `WalletRec` table. All the data in the column will be lost.
  - Added the required column `origin_balance` to the `WalletRec` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result_balance` to the `WalletRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WalletRec" DROP COLUMN "origin_amount",
ADD COLUMN     "origin_balance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "result_balance" DOUBLE PRECISION NOT NULL;
