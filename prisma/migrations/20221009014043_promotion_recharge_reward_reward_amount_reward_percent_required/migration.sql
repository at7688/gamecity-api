/*
  Warnings:

  - Made the column `reward_amount` on table `RechargeReward` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reward_percent` on table `RechargeReward` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "RechargeReward" ALTER COLUMN "reward_amount" SET NOT NULL,
ALTER COLUMN "reward_percent" SET NOT NULL;
