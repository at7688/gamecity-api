-- CreateTable
CREATE TABLE "GameRatio" (
    "id" SERIAL NOT NULL,
    "game_code" TEXT NOT NULL,
    "platform_code" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GameRatio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameRatio_platform_code_game_code_player_id_key" ON "GameRatio"("platform_code", "game_code", "player_id");

-- AddForeignKey
ALTER TABLE "GameRatio" ADD CONSTRAINT "GameRatio_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameRatio" ADD CONSTRAINT "GameRatio_game_code_platform_code_fkey" FOREIGN KEY ("game_code", "platform_code") REFERENCES "Game"("code", "platform_code") ON DELETE RESTRICT ON UPDATE CASCADE;
