-- DropForeignKey
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_to_member_id_fkey";

-- AlterTable
ALTER TABLE "Inbox" ADD COLUMN     "to_player_id" TEXT,
ALTER COLUMN "to_member_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_blocked" BOOLEAN NOT NULL DEFAULT false,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "promo_code" TEXT,
    "vip_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "inviter_id" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vip" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "ebet_min" INTEGER NOT NULL,
    "deposite_min" INTEGER NOT NULL,
    "withdraw_min" INTEGER NOT NULL,
    "withdraw_max" INTEGER NOT NULL,

    CONSTRAINT "Vip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_username_key" ON "Player"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Player_promo_code_key" ON "Player"("promo_code");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_vip_id_fkey" FOREIGN KEY ("vip_id") REFERENCES "Vip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_to_member_id_fkey" FOREIGN KEY ("to_member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_to_player_id_fkey" FOREIGN KEY ("to_player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
