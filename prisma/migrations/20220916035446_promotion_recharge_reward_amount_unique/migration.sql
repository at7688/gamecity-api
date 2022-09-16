/*
  Warnings:

  - A unique constraint covering the columns `[promotion_id,recharge_amount]` on the table `RechargeReward` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RechargeReward_promotion_id_recharge_amount_key" ON "RechargeReward"("promotion_id", "recharge_amount");
