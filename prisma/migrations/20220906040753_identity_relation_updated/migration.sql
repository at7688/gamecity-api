/*
  Warnings:

  - You are about to drop the column `identity_id` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id]` on the table `IdentityVerify` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `player_id` to the `IdentityVerify` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_identity_id_fkey";

-- DropIndex
DROP INDEX "Player_identity_id_key";

-- AlterTable
ALTER TABLE "IdentityVerify" ADD COLUMN     "player_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "identity_id";

-- CreateIndex
CREATE UNIQUE INDEX "IdentityVerify_player_id_key" ON "IdentityVerify"("player_id");

-- AddForeignKey
ALTER TABLE "IdentityVerify" ADD CONSTRAINT "IdentityVerify_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
