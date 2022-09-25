/*
  Warnings:

  - A unique constraint covering the columns `[applicant_id]` on the table `Gift` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "applicant_id" TEXT;

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Gift_applicant_id_key" ON "Gift"("applicant_id");

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
