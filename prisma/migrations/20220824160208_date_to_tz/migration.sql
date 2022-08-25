/*
  Warnings:

  - You are about to drop the `ActivityPromo` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "BankDepositRec" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "BankWithdrawRec" ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Banner" ALTER COLUMN "start_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "end_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "CompanyCard" ALTER COLUMN "accumulate_from" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Inbox" ALTER COLUMN "opened_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "InboxRec" ALTER COLUMN "sended_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "LoginRec" ALTER COLUMN "login_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "MerchantBill" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "expired_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "paid_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "PaymentDepositRec" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "paid_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "finished_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "canceled_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "expired_at" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ;

-- DropTable
DROP TABLE "ActivityPromo";
