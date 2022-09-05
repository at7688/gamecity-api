-- CreateTable
CREATE TABLE "TransferRec" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "source_id" TEXT,
    "target_player_id" TEXT,
    "target_agent_id" TEXT,
    "operator_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "rolling_demand" INTEGER NOT NULL,
    "note" TEXT,
    "outter_note" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransferRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_target_player_id_fkey" FOREIGN KEY ("target_player_id") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_target_agent_id_fkey" FOREIGN KEY ("target_agent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
