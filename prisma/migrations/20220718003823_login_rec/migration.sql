/*
  Warnings:

  - You are about to drop the column `login_at` on the `AdminUser` table. All the data in the column will be lost.
  - You are about to drop the column `login_at` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminUser" DROP COLUMN "login_at";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "login_at";

-- CreateTable
CREATE TABLE "LoginRec" (
    "id" SERIAL NOT NULL,
    "admin_user_id" TEXT,
    "agent_id" TEXT,
    "ip" TEXT,
    "login_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginRec_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginRec" ADD CONSTRAINT "LoginRec_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginRec" ADD CONSTRAINT "LoginRec_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
