-- AlterTable
ALTER TABLE "PaymentMerchant" ALTER COLUMN "is_active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "PaymentTool" ALTER COLUMN "is_active" SET DEFAULT true,
ALTER COLUMN "is_current" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Payway" ALTER COLUMN "player_fee_amount" DROP NOT NULL,
ALTER COLUMN "player_fee_percent" DROP NOT NULL,
ALTER COLUMN "fee_amount" DROP NOT NULL,
ALTER COLUMN "fee_percent" DROP NOT NULL;
