/*
  Warnings:

  - You are about to drop the column `nums_rolling` on the `TransferRec` table. All the data in the column will be lost.
  - Made the column `source_id` on table `TransferRec` required. This step will fail if there are existing NULL values in that column.
  - Made the column `target_id` on table `TransferRec` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TransferRec" DROP CONSTRAINT "TransferRec_source_id_fkey";

-- DropForeignKey
ALTER TABLE "TransferRec" DROP CONSTRAINT "TransferRec_target_id_fkey";

-- AlterTable
ALTER TABLE "TransferRec" DROP COLUMN "nums_rolling",
ALTER COLUMN "source_id" SET NOT NULL,
ALTER COLUMN "target_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferRec" ADD CONSTRAINT "TransferRec_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
