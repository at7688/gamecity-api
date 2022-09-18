/*
  Warnings:

  - You are about to drop the column `transfer_back_at` on the `GamePlatform` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_to_at` on the `GamePlatform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GamePlatform" DROP COLUMN "transfer_back_at",
DROP COLUMN "transfer_to_at",
ADD COLUMN     "has_credit" BOOLEAN NOT NULL DEFAULT false;
