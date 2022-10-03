-- AlterTable
ALTER TABLE "SmsMerchant" ALTER COLUMN "config" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SysConfig" (
    "code" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "SysConfig_pkey" PRIMARY KEY ("code")
);
