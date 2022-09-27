/*
  Warnings:

  - You are about to drop the column `current_rolling` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `required_rolling` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "current_rolling",
DROP COLUMN "required_rolling";
