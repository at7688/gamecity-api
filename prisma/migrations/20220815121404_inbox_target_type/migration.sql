/*
  Warnings:

  - You are about to drop the column `send_type` on the `InboxRec` table. All the data in the column will be lost.
  - You are about to drop the `AgentWithSubNums` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `target_type` to the `InboxRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InboxRec" DROP COLUMN "send_type",
ADD COLUMN     "target_type" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AgentWithSubNums";

-- DropEnum
DROP TYPE "InboxSendType";
