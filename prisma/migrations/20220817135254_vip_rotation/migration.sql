/*
  Warnings:

  - You are about to drop the column `card_id` on the `Vip` table. All the data in the column will be lost.
  - Added the required column `card_rotate_id` to the `Vip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_rotate_id` to the `Vip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vip" DROP CONSTRAINT "Vip_card_id_fkey";

-- AlterTable
ALTER TABLE "CompanyCard" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Vip" DROP COLUMN "card_id",
ADD COLUMN     "card_rotate_id" INTEGER NOT NULL,
ADD COLUMN     "payment_rotate_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_card_rotate_id_fkey" FOREIGN KEY ("card_rotate_id") REFERENCES "RotationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vip" ADD CONSTRAINT "Vip_payment_rotate_id_fkey" FOREIGN KEY ("payment_rotate_id") REFERENCES "RotationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
