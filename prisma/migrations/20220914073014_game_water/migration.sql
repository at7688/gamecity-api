-- CreateTable
CREATE TABLE "GameWater" (
    "game_code" TEXT NOT NULL,
    "platform_code" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "ratio" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GameWater_platform_code_game_code_agent_id_key" ON "GameWater"("platform_code", "game_code", "agent_id");

-- AddForeignKey
ALTER TABLE "GameWater" ADD CONSTRAINT "GameWater_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameWater" ADD CONSTRAINT "GameWater_game_code_platform_code_fkey" FOREIGN KEY ("game_code", "platform_code") REFERENCES "Game"("code", "platform_code") ON DELETE RESTRICT ON UPDATE CASCADE;
