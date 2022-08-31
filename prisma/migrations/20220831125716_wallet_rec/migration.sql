-- AlterTable
ALTER TABLE "MerchantOrder" ALTER COLUMN "status" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "WalletRec" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,
    "origin_amount" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "operator_id" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "WalletRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WalletRec" ADD CONSTRAINT "WalletRec_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletRec" ADD CONSTRAINT "WalletRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
