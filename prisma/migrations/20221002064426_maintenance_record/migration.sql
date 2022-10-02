-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "repeat_end_at" TIMESTAMPTZ,
ADD COLUMN     "repeat_start_at" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "MaintenanceRec" (
    "id" SERIAL NOT NULL,
    "start_at" TIMESTAMPTZ,
    "end_at" TIMESTAMPTZ,
    "maintenance_id" INTEGER NOT NULL,

    CONSTRAINT "MaintenanceRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceRec" ADD CONSTRAINT "MaintenanceRec_maintenance_id_fkey" FOREIGN KEY ("maintenance_id") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
