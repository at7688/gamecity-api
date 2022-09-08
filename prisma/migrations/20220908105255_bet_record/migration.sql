-- AlterTable
ALTER TABLE "GamePlatform" ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "BetRecord" (
    "betNo" TEXT NOT NULL,
    "round_id" TEXT NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "amount" DOUBLE PRECISION NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "game_type" INTEGER NOT NULL,
    "bet_type" INTEGER NOT NULL,
    "commission_type" INTEGER NOT NULL DEFAULT 1,
    "bet_at" TIMESTAMPTZ NOT NULL,
    "table_code" TEXT,
    "ip" TEXT,

    CONSTRAINT "BetRecord_pkey" PRIMARY KEY ("betNo")
);
