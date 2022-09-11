-- AlterTable
ALTER TABLE "GamePlatform" ADD COLUMN     "currency" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "record_check_at" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" SERIAL NOT NULL,
    "target_type" INTEGER NOT NULL,
    "platform_code" TEXT,
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_platform_code_fkey" FOREIGN KEY ("platform_code") REFERENCES "GamePlatform"("code") ON DELETE SET NULL ON UPDATE CASCADE;
