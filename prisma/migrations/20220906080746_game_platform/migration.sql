/*
  Warnings:

  - You are about to drop the column `is_active` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `GamePlatform` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `category_id` on the `GamePlatform` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `GamePlatform` table. All the data in the column will be lost.
  - You are about to drop the `GameCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `platform_code` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `GamePlatform` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `GamePlatform` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "GamePlatform" DROP CONSTRAINT "GamePlatform_category_id_fkey";

-- DropIndex
DROP INDEX "GamePlatform_code_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "is_active",
DROP COLUMN "platform_id",
ADD COLUMN     "platform_code" TEXT NOT NULL,
ALTER COLUMN "sort" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "GamePlatform" DROP CONSTRAINT "GamePlatform_pkey",
DROP COLUMN "category_id",
DROP COLUMN "id",
ADD COLUMN     "category" INTEGER NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER NOT NULL,
ALTER COLUMN "sort" SET DEFAULT 0,
ADD CONSTRAINT "GamePlatform_pkey" PRIMARY KEY ("code");

-- DropTable
DROP TABLE "GameCategory";

-- DropEnum
DROP TYPE "GamePlatformStatus";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_platform_code_fkey" FOREIGN KEY ("platform_code") REFERENCES "GamePlatform"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
