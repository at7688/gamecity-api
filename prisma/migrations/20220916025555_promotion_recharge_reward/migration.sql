-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "each_apply_times" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "RechargeReward" (
    "promotion_id" TEXT NOT NULL,
    "recharge_amount" INTEGER NOT NULL,
    "reward_amount" INTEGER NOT NULL,
    "reward_percent" DOUBLE PRECISION NOT NULL,
    "type" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RechargeReward_promotion_id_key" ON "RechargeReward"("promotion_id");

-- AddForeignKey
ALTER TABLE "RechargeReward" ADD CONSTRAINT "RechargeReward_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
