/*
  Warnings:

  - A unique constraint covering the columns `[contact_id]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contact_id]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "InboxSendType" AS ENUM ('PRIVATE', 'AGENTS', 'PLAYERS', 'SYSTEM');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "contact_id" INTEGER;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "contact_id" INTEGER;

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "lineID" TEXT NOT NULL,
    "telegram" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_contact_id_key" ON "Member"("contact_id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_contact_id_key" ON "Player"("contact_id");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
