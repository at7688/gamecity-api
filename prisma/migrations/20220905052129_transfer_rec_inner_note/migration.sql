/*
  Warnings:

  - You are about to drop the column `note` on the `TransferRec` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransferRec" DROP COLUMN "note",
ADD COLUMN     "inner_note" TEXT;
