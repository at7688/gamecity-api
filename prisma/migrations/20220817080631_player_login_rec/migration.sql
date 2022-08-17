/*
  Warnings:

  - You are about to drop the column `lineID` on the `Contact` table. All the data in the column will be lost.
  - Added the required column `platform` to the `LoginRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "lineID",
ADD COLUMN     "line_id" TEXT;

-- AlterTable
ALTER TABLE "LoginRec" ADD COLUMN     "platform" INTEGER NOT NULL,
ADD COLUMN     "player_id" TEXT;

-- AddForeignKey
ALTER TABLE "LoginRec" ADD CONSTRAINT "LoginRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
