/*
  Warnings:

  - You are about to drop the column `operator_id` on the `TransferRec` table. All the data in the column will be lost.
  - You are about to drop the column `target_agent_id` on the `TransferRec` table. All the data in the column will be lost.
  - You are about to drop the column `target_player_id` on the `TransferRec` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `TransferRec` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransferRec" DROP CONSTRAINT "TransferRec_operator_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferRec" DROP CONSTRAINT "TransferRec_target_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferRec" DROP CONSTRAINT "TransferRec_target_player_id_fkey";

-- AlterTable
ALTER TABLE "TransferRec" DROP COLUMN "operator_id",
DROP COLUMN "target_agent_id",
DROP COLUMN "target_player_id",
DROP COLUMN "type",
ADD COLUMN     "target_id" TEXT;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
