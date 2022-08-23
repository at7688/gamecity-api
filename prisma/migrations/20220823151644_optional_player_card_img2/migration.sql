-- DropForeignKey
ALTER TABLE "PlayerCard" DROP CONSTRAINT "PlayerCard_img2_id_fkey";

-- AlterTable
ALTER TABLE "PlayerCard" ALTER COLUMN "img2_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_img2_id_fkey" FOREIGN KEY ("img2_id") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
