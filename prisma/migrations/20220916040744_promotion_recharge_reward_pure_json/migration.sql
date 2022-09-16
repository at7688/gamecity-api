/*
  Warnings:

  - You are about to drop the `RechargeReward` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RechargeReward" DROP CONSTRAINT "RechargeReward_promotion_id_fkey";

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "recharge_reward" JSONB;

-- DropTable
DROP TABLE "RechargeReward";
