/*
  Warnings:

  - You are about to drop the column `inbox_type` on the `InboxRec` table. All the data in the column will be lost.
  - Added the required column `send_type` to the `InboxRec` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InboxRec" DROP COLUMN "inbox_type",
ADD COLUMN     "send_type" "InboxSendType" NOT NULL;
