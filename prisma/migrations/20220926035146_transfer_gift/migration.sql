-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_promotion_id_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "rolling_demand" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "sender_id" TEXT,
ADD COLUMN     "type" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "promotion_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Promotion" ALTER COLUMN "rolling_demand" SET DEFAULT 1,
ALTER COLUMN "rolling_demand" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TransferRec" ALTER COLUMN "rolling_demand" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WalletRec" ALTER COLUMN "rolling_amount" SET DATA TYPE DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
