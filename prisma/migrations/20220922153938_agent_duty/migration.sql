/*
  Warnings:

  - You are about to drop the column `fee_duty` on the `Member` table. All the data in the column will be lost.
  - You are about to drop the column `promotion_duty` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "fee_duty",
DROP COLUMN "promotion_duty";

-- CreateTable
CREATE TABLE "AgentDuty" (
    "agent_id" TEXT NOT NULL,
    "promotion_duty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fee_duty" DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentDuty_agent_id_key" ON "AgentDuty"("agent_id");

-- AddForeignKey
ALTER TABLE "AgentDuty" ADD CONSTRAINT "AgentDuty_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
