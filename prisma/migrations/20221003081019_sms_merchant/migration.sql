-- CreateTable
CREATE TABLE "SmsMerchant" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "info" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SmsMerchant_pkey" PRIMARY KEY ("code")
);
