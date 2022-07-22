/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Menu` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Menu_path_key" ON "Menu"("path");
