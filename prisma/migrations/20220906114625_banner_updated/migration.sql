/*
  Warnings:

  - You are about to drop the column `mb_img_id` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `pc_img_id` on the `Banner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[banner_id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lang` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Banner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Banner` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_mb_img_id_fkey";

-- DropForeignKey
ALTER TABLE "Banner" DROP CONSTRAINT "Banner_pc_img_id_fkey";

-- DropIndex
DROP INDEX "Banner_mb_img_id_key";

-- DropIndex
DROP INDEX "Banner_pc_img_id_key";

-- AlterTable
ALTER TABLE "Banner" DROP COLUMN "mb_img_id",
DROP COLUMN "name",
DROP COLUMN "pc_img_id",
ADD COLUMN     "is_new_win" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lang" TEXT NOT NULL,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "platform" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "banner_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Image_banner_id_key" ON "Image"("banner_id");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "Banner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
