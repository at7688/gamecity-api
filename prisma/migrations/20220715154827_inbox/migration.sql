-- CreateEnum
CREATE TYPE "InboxSendType" AS ENUM ('PRIVATE', 'AGENTS', 'MEMBERS', 'SYSTEM');

-- CreateTable
CREATE TABLE "Inbox" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "from_member_id" TEXT NOT NULL,
    "to_member_id" TEXT NOT NULL,
    "opened_at" TIMESTAMP(3),
    "inbox_rec_id" TEXT NOT NULL,

    CONSTRAINT "Inbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboxRec" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "inbox_type" "InboxSendType" NOT NULL,
    "sended_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboxRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "AdminUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_from_member_id_fkey" FOREIGN KEY ("from_member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_to_member_id_fkey" FOREIGN KEY ("to_member_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_inbox_rec_id_fkey" FOREIGN KEY ("inbox_rec_id") REFERENCES "InboxRec"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
