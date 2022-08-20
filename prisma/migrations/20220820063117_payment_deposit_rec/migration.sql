-- CreateTable
CREATE TABLE "PaymentDepositRec" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "payway_id" TEXT NOT NULL,
    "merchant_trade_no" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "PaymentDepositRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDepositRec" ADD CONSTRAINT "PaymentDepositRec_payway_id_fkey" FOREIGN KEY ("payway_id") REFERENCES "Payway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
