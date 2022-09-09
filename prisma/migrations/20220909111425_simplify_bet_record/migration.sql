/*
  Warnings:

  - You are about to drop the column `commission_type` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `deposit` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `round_id` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `table_code` on the `BetRecord` table. All the data in the column will be lost.
  - You are about to drop the column `trade_no` on the `BetRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BetRecord" DROP COLUMN "commission_type",
DROP COLUMN "deposit",
DROP COLUMN "ip",
DROP COLUMN "round_id",
DROP COLUMN "table_code",
DROP COLUMN "trade_no";
