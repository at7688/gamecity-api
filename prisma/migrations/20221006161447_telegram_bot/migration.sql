-- CreateTable
CREATE TABLE "TelegramBot" (
    "chat_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "TelegramBot_pkey" PRIMARY KEY ("chat_id")
);
