/*
  Warnings:

  - A unique constraint covering the columns `[promo_code]` on the table `Member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberType" AS ENUM ('Player', 'Agent');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "promo_code" TEXT,
ADD COLUMN     "type" "MemberType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Member_promo_code_key" ON "Member"("promo_code");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
