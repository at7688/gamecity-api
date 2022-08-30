/*
  Warnings:

  - Made the column `player_fee_amount` on table `Payway` required. This step will fail if there are existing NULL values in that column.
  - Made the column `player_fee_percent` on table `Payway` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fee_amount` on table `Payway` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fee_percent` on table `Payway` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payway" ADD COLUMN     "fee_type" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "player_fee_amount" SET NOT NULL,
ALTER COLUMN "player_fee_amount" SET DEFAULT 0,
ALTER COLUMN "player_fee_percent" SET NOT NULL,
ALTER COLUMN "player_fee_percent" SET DEFAULT 0,
ALTER COLUMN "player_fee_min" SET DEFAULT 10,
ALTER COLUMN "player_fee_max" SET DEFAULT 200,
ALTER COLUMN "fee_amount" SET NOT NULL,
ALTER COLUMN "fee_amount" SET DEFAULT 0,
ALTER COLUMN "fee_percent" SET NOT NULL,
ALTER COLUMN "fee_percent" SET DEFAULT 0,
ALTER COLUMN "fee_min" SET DEFAULT 10,
ALTER COLUMN "fee_max" SET DEFAULT 200;
