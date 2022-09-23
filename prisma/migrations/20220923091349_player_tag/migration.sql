-- CreateTable
CREATE TABLE "PlayerTag" (
    "player_id" TEXT NOT NULL,
    "type" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerTag_player_id_type_key" ON "PlayerTag"("player_id", "type");

-- AddForeignKey
ALTER TABLE "PlayerTag" ADD CONSTRAINT "PlayerTag_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
