-- CreateTable
CREATE TABLE "BetRecordTicket" (
    "id" SERIAL NOT NULL,
    "max_range" INTEGER NOT NULL,
    "in_days" INTEGER NOT NULL,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "platform_code" TEXT NOT NULL,

    CONSTRAINT "BetRecordTicket_pkey" PRIMARY KEY ("id")
);
