/*
  Warnings:

  - You are about to drop the column `promo_code` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `promo_code` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agent_id]` on the table `PromoCode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inviter_id]` on the table `PromoCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_promo_code_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_promo_code_fkey";

-- DropIndex
DROP INDEX "Member_promo_code_key";

-- DropIndex
DROP INDEX "Player_promo_code_key";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "promo_code";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "promo_code",
ADD COLUMN     "invited_code" TEXT;

-- AlterTable
ALTER TABLE "PromoCode" ADD COLUMN     "agent_id" TEXT,
ADD COLUMN     "inviter_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_agent_id_key" ON "PromoCode"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_inviter_id_key" ON "PromoCode"("inviter_id");

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_invited_code_fkey" FOREIGN KEY ("invited_code") REFERENCES "PromoCode"("code") ON DELETE SET NULL ON UPDATE CASCADE;
