-- CreateTable
CREATE TABLE "BetRatioRec" (
    "id" SERIAL NOT NULL,
    "agent_id" TEXT NOT NULL,
    "bet_id" TEXT NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BetRatioRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BetRatioRec" ADD CONSTRAINT "BetRatioRec_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BetRatioRec" ADD CONSTRAINT "BetRatioRec_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "BetRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
