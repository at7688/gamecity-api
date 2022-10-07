/*
  Warnings:

  - The primary key for the `TelegramBot` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TelegramBot" DROP CONSTRAINT "TelegramBot_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TelegramBot_pkey" PRIMARY KEY ("id");
