/*
  Warnings:

  - You are about to drop the column `agent_id` on the `GameWater` table. All the data in the column will be lost.
  - You are about to drop the column `ratio` on the `GameWater` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platform_code,game_code,promotion_id]` on the table `GameWater` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `promotion_id` to the `GameWater` table without a default value. This is not possible if the table is not empty.
  - Added the required column `water` to the `GameWater` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GameWater" DROP CONSTRAINT "GameWater_agent_id_fkey";

-- DropIndex
DROP INDEX "GameWater_platform_code_game_code_agent_id_key";

-- AlterTable
ALTER TABLE "GameRatio" ADD COLUMN     "water" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "GameWater" DROP COLUMN "agent_id",
DROP COLUMN "ratio",
ADD COLUMN     "promotion_id" TEXT NOT NULL,
ADD COLUMN     "water" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "condition" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "apply_approval_rule" INTEGER NOT NULL DEFAULT 1,
    "auto_apply_schedule" INTEGER,
    "pay_approval_rule" INTEGER NOT NULL DEFAULT 1,
    "auto_pay_schedule" INTEGER,
    "rolling_demand" INTEGER NOT NULL DEFAULT 1,
    "reward_max" INTEGER NOT NULL DEFAULT 0,
    "applicants_max" INTEGER NOT NULL DEFAULT 0,
    "each_apply_times" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PromotionToVip" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PromotionToVip_AB_unique" ON "_PromotionToVip"("A", "B");

-- CreateIndex
CREATE INDEX "_PromotionToVip_B_index" ON "_PromotionToVip"("B");

-- CreateIndex
CREATE UNIQUE INDEX "GameWater_platform_code_game_code_promotion_id_key" ON "GameWater"("platform_code", "game_code", "promotion_id");

-- AddForeignKey
ALTER TABLE "GameWater" ADD CONSTRAINT "GameWater_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToVip" ADD CONSTRAINT "_PromotionToVip_A_fkey" FOREIGN KEY ("A") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromotionToVip" ADD CONSTRAINT "_PromotionToVip_B_fkey" FOREIGN KEY ("B") REFERENCES "Vip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
