-- CreateTable
CREATE TABLE "MerchantLog" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "merchant_code" "MerchantCode" NOT NULL,
    "data" JSONB,

    CONSTRAINT "MerchantLog_pkey" PRIMARY KEY ("id")
);
