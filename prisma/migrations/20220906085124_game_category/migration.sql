/*
  Warnings:

  - You are about to drop the column `category` on the `GamePlatform` table. All the data in the column will be lost.
  - Added the required column `category_code` to the `GamePlatform` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "category",
ADD COLUMN     "category_code" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GameCategory" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "GamePlatform" ADD CONSTRAINT "GamePlatform_category_code_fkey" FOREIGN KEY ("category_code") REFERENCES "GameCategory"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
