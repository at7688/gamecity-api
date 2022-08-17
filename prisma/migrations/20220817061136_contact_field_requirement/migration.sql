-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_player_id_fkey";

-- AlterTable
ALTER TABLE "Contact" ALTER COLUMN "lineID" DROP NOT NULL,
ALTER COLUMN "telegram" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "agent_id" DROP NOT NULL,
ALTER COLUMN "player_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
