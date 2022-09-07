/*
  Warnings:

  - The primary key for the `PageContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[code,lang]` on the table `PageContent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PageContent" DROP CONSTRAINT "PageContent_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PageContent_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "PageContent_code_lang_key" ON "PageContent"("code", "lang");
