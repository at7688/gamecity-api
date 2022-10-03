/*
  Warnings:

  - You are about to drop the `MaintenanceRec` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MaintenanceRec" DROP CONSTRAINT "MaintenanceRec_maintenance_id_fkey";

-- DropTable
DROP TABLE "MaintenanceRec";
