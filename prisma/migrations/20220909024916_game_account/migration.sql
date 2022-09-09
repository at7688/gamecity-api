-- CreateTable
CREATE TABLE "GameAccount" (
    "id" SERIAL NOT NULL,
    "platform_code" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "password" TEXT,
    "player_id" TEXT NOT NULL,

    CONSTRAINT "GameAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameAccount_platform_code_account_key" ON "GameAccount"("platform_code", "account");

-- CreateIndex
CREATE UNIQUE INDEX "GameAccount_platform_code_player_id_key" ON "GameAccount"("platform_code", "player_id");

-- AddForeignKey
ALTER TABLE "GameAccount" ADD CONSTRAINT "GameAccount_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameAccount" ADD CONSTRAINT "GameAccount_platform_code_fkey" FOREIGN KEY ("platform_code") REFERENCES "GamePlatform"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
