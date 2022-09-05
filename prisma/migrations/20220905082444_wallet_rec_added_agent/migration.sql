-- DropForeignKey
ALTER TABLE "WalletRec" DROP CONSTRAINT "WalletRec_player_id_fkey";

-- AlterTable
ALTER TABLE "WalletRec" ADD COLUMN     "agent_id" TEXT,
ALTER COLUMN "player_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "WalletRec" ADD CONSTRAINT "WalletRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRec" ADD CONSTRAINT "WalletRec_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
