/*
  Warnings:

  - You are about to drop the column `mb_img` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `pc_img` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `imgs` on the `PlayerCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pc_img_id]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mb_img_id]` on the table `Banner` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[img_id]` on the table `PlayerCard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[img2_id]` on the table `PlayerCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mb_img_id` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pc_img_id` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img2_id` to the `PlayerCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `img_id` to the `PlayerCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "mb_img",
DROP COLUMN "pc_img",
ADD COLUMN     "mb_img_id" INTEGER NOT NULL,
ADD COLUMN     "pc_img_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PlayerCard" DROP COLUMN "imgs",
ADD COLUMN     "img2_id" INTEGER NOT NULL,
ADD COLUMN     "img_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Banner_pc_img_id_key" ON "Banner"("pc_img_id");

-- CreateIndex
CREATE UNIQUE INDEX "Banner_mb_img_id_key" ON "Banner"("mb_img_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_img_id_key" ON "PlayerCard"("img_id");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerCard_img2_id_key" ON "PlayerCard"("img2_id");

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_img_id_fkey" FOREIGN KEY ("img_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_img2_id_fkey" FOREIGN KEY ("img2_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_pc_img_id_fkey" FOREIGN KEY ("pc_img_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Banner" ADD CONSTRAINT "Banner_mb_img_id_fkey" FOREIGN KEY ("mb_img_id") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
