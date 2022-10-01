-- AlterTable
ALTER TABLE "BetRecordTicket" ALTER COLUMN "expired_at" DROP NOT NULL,
ALTER COLUMN "valid_at" DROP NOT NULL;
