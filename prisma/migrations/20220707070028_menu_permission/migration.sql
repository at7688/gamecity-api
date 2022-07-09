/*
  Warnings:

  - You are about to drop the `_AdminRoleToPermission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AdminRoleToPermission" DROP CONSTRAINT "_AdminRoleToPermission_A_fkey";

-- DropForeignKey
ALTER TABLE "_AdminRoleToPermission" DROP CONSTRAINT "_AdminRoleToPermission_B_fkey";

-- DropTable
DROP TABLE "_AdminRoleToPermission";

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "root_menu_id" TEXT,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AdminRoleToMenu" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AdminRoleToMenu_AB_unique" ON "_AdminRoleToMenu"("A", "B");

-- CreateIndex
CREATE INDEX "_AdminRoleToMenu_B_index" ON "_AdminRoleToMenu"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToPermission_AB_unique" ON "_MenuToPermission"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToPermission_B_index" ON "_MenuToPermission"("B");

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_root_menu_id_fkey" FOREIGN KEY ("root_menu_id") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminRoleToMenu" ADD CONSTRAINT "_AdminRoleToMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "AdminRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminRoleToMenu" ADD CONSTRAINT "_AdminRoleToMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToPermission" ADD CONSTRAINT "_MenuToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToPermission" ADD CONSTRAINT "_MenuToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
