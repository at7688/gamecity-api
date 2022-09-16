/*
  Warnings:

  - You are about to drop the column `each_apply_times` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `recharge_reward` on the `Promotion` table. All the data in the column will be lost.
  - You are about to drop the column `rolling_type` on the `Promotion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "each_apply_times",
DROP COLUMN "recharge_reward",
DROP COLUMN "rolling_type",
ADD COLUMN     "applicants_limit_type" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "apply_limit_type" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "apply_times" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RechargeReward" (
    "promotion_id" TEXT NOT NULL,
    "recharge_amount" INTEGER NOT NULL,
    "reward_type" INTEGER NOT NULL,
    "reward_amount" INTEGER NOT NULL,
    "reward_percent" DOUBLE PRECISION NOT NULL,
    "rolling_type" INTEGER NOT NULL DEFAULT 1
);

-- CreateIndex
CREATE UNIQUE INDEX "RechargeReward_promotion_id_key" ON "RechargeReward"("promotion_id");

-- CreateIndex
CREATE UNIQUE INDEX "RechargeReward_promotion_id_recharge_amount_key" ON "RechargeReward"("promotion_id", "recharge_amount");

-- AddForeignKey
ALTER TABLE "RechargeReward" ADD CONSTRAINT "RechargeReward_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
