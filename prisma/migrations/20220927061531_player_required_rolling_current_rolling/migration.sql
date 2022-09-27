/*
  Warnings:

  - You are about to drop the column `rolling_amount` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "rolling_amount",
ADD COLUMN     "current_rolling" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "required_rolling" DOUBLE PRECISION NOT NULL DEFAULT 0;
