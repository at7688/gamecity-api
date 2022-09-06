/*
  Warnings:

  - You are about to drop the column `img2_id` on the `PlayerCard` table. All the data in the column will be lost.
  - You are about to drop the column `img_id` on the `PlayerCard` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identity_id]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PlayerCard" DROP CONSTRAINT "PlayerCard_img2_id_fkey";

-- DropForeignKey
ALTER TABLE "PlayerCard" DROP CONSTRAINT "PlayerCard_img_id_fkey";

-- DropIndex
DROP INDEX "PlayerCard_img2_id_key";

-- DropIndex
DROP INDEX "PlayerCard_img_id_key";

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "identity_id" TEXT,
ADD COLUMN     "p_card_id" TEXT;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "identity_id" TEXT;

-- AlterTable
ALTER TABLE "PlayerCard" DROP COLUMN "img2_id",
DROP COLUMN "img_id";

-- CreateTable
CREATE TABLE "IdentityVerify" (
    "id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "id_card_num" TEXT NOT NULL,

    CONSTRAINT "IdentityVerify_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_identity_id_key" ON "Player"("identity_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityVerify"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_p_card_id_fkey" FOREIGN KEY ("p_card_id") REFERENCES "PlayerCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_identity_id_fkey" FOREIGN KEY ("identity_id") REFERENCES "IdentityVerify"("id") ON DELETE SET NULL ON UPDATE CASCADE;
