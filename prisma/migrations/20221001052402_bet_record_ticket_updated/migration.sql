/*
  Warnings:

  - You are about to drop the column `in_days` on the `BetRecordTicket` table. All the data in the column will be lost.
  - You are about to drop the column `max_range` on the `BetRecordTicket` table. All the data in the column will be lost.
  - Added the required column `kept_days` to the `BetRecordTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_seconds` to the `BetRecordTicket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valid_at` to the `BetRecordTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BetRecordTicket" DROP COLUMN "in_days",
DROP COLUMN "max_range",
ADD COLUMN     "kept_days" INTEGER NOT NULL,
ADD COLUMN     "max_seconds" INTEGER NOT NULL,
ADD COLUMN     "valid_at" TIMESTAMPTZ(6) NOT NULL;
