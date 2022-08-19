/*
  Warnings:

  - Added the required column `tool_id` to the `Payway` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payway" ADD COLUMN     "tool_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Payway" ADD CONSTRAINT "Payway_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "PaymentTool"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
