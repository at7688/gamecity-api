/*
  Warnings:

  - Added the required column `amount` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rolling_amount` to the `Gift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rolling_amount" DOUBLE PRECISION NOT NULL;
