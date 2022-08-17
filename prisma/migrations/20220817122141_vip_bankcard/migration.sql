/*
  Warnings:

  - Added the required column `card_id` to the `Vip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vip" ADD COLUMN     "card_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "CompanyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
