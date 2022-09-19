/*
  Warnings:

  - A unique constraint covering the columns `[platform_code,game_code,vip_id]` on the table `GameWater` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GameWater" DROP CONSTRAINT "GameWater_promotion_id_fkey";

-- AlterTable
ALTER TABLE "GameWater" ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "vip_id" TEXT,
ALTER COLUMN "promotion_id" DROP NOT NULL,
ADD CONSTRAINT "GameWater_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "GameWater_platform_code_game_code_vip_id_key" ON "GameWater"("platform_code", "game_code", "vip_id");

-- AddForeignKey
ALTER TABLE "GameWater" ADD CONSTRAINT "GameWater_vip_id_fkey" FOREIGN KEY ("vip_id") REFERENCES "Vip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameWater" ADD CONSTRAINT "GameWater_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
