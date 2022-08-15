-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_inviter_id_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_vip_id_fkey";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "vip_id" DROP NOT NULL,
ALTER COLUMN "inviter_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PromoCode" (
    "code" TEXT NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "AgentWithSubNums" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "parent_id" TEXT,
    "type" "MemberType" NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_blocked" BOOLEAN NOT NULL,
    "layer" INTEGER NOT NULL,
    "all_agents" INTEGER NOT NULL,
    "all_players" INTEGER NOT NULL,
    "self_agents" INTEGER NOT NULL,
    "self_players" INTEGER NOT NULL,
    "parents" JSON,
    "ip" TEXT,
    "login_at" TIMESTAMP(3),
    "nums_failed" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentWithSubNums_username_key" ON "AgentWithSubNums"("username");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_promo_code_fkey" FOREIGN KEY ("promo_code") REFERENCES "PromoCode"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_promo_code_fkey" FOREIGN KEY ("promo_code") REFERENCES "PromoCode"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_vip_id_fkey" FOREIGN KEY ("vip_id") REFERENCES "Vip"("id") ON DELETE SET NULL ON UPDATE CASCADE;
