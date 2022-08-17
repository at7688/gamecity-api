/*
  Warnings:

  - You are about to drop the column `balance` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "balance";

-- CreateTable
CREATE TABLE "ChipsRec" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" INTEGER NOT NULL,

    CONSTRAINT "ChipsRec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RotationGroup" (
    "id" SERIAL NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "RotationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerCard" (
    "id" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "valid_status" INTEGER NOT NULL,
    "imgs" TEXT[],

    CONSTRAINT "PlayerCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyCard" (
    "id" TEXT NOT NULL,
    "bank_code" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "total_max" INTEGER NOT NULL,
    "rotation_id" INTEGER NOT NULL,

    CONSTRAINT "CompanyCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDepositRec" (
    "id" TEXT NOT NULL,
    "player_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "card_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL,
    "acc_tail" TEXT NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "BankDepositRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChipsRec" ADD CONSTRAINT "ChipsRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerCard" ADD CONSTRAINT "PlayerCard_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCard" ADD CONSTRAINT "CompanyCard_rotation_id_fkey" FOREIGN KEY ("rotation_id") REFERENCES "RotationGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDepositRec" ADD CONSTRAINT "BankDepositRec_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "CompanyCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDepositRec" ADD CONSTRAINT "BankDepositRec_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
