/*
  Warnings:

  - You are about to drop the column `is_first` on the `WithdrawRec` table. All the data in the column will be lost.
  - Added the required column `times` to the `WithdrawRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WithdrawRec" DROP COLUMN "is_first",
ADD COLUMN     "times" INTEGER NOT NULL;
