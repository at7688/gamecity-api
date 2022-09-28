/*
  Warnings:

  - You are about to drop the column `agent_id` on the `PromoCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parent_id]` on the table `PromoCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PromoCode" DROP CONSTRAINT "PromoCode_agent_id_fkey";

-- DropIndex
DROP INDEX "PromoCode_agent_id_key";

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "invited_code" TEXT;

-- AlterTable
ALTER TABLE "PromoCode" DROP COLUMN "agent_id",
ADD COLUMN     "parent_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_parent_id_key" ON "PromoCode"("parent_id");

-- AddForeignKey
ALTER TABLE "PromoCode" ADD CONSTRAINT "PromoCode_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_invited_code_fkey" FOREIGN KEY ("invited_code") REFERENCES "PromoCode"("code") ON DELETE SET NULL ON UPDATE CASCADE;
