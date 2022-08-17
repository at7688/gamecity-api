/*
  Warnings:

  - You are about to drop the column `contact_id` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `contact_id` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[player_id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[agent_id]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `agent_id` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_id` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_contact_id_fkey";

-- DropIndex
DROP INDEX "Member_contact_id_key";

-- DropIndex
DROP INDEX "Player_contact_id_key";

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "agent_id" TEXT NOT NULL,
ADD COLUMN     "player_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "contact_id";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "contact_id";

-- CreateIndex
CREATE UNIQUE INDEX "Contact_player_id_key" ON "Contact"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_agent_id_key" ON "Contact"("agent_id");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
