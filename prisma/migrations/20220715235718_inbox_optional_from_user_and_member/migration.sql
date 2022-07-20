-- DropForeignKey
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_from_member_id_fkey";

-- DropForeignKey
ALTER TABLE "Inbox" DROP CONSTRAINT "Inbox_from_user_id_fkey";

-- AlterTable
ALTER TABLE "Inbox" ALTER COLUMN "from_user_id" DROP NOT NULL,
ALTER COLUMN "from_member_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inbox" ADD CONSTRAINT "Inbox_from_member_id_fkey" FOREIGN KEY ("from_member_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
