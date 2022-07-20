-- DropForeignKey
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_inbox_rec_id_fkey";

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_inbox_rec_id_fkey" FOREIGN KEY ("inbox_rec_id") REFERENCES "InboxRec"("id") ON DELETE CASCADE ON UPDATE CASCADE;
