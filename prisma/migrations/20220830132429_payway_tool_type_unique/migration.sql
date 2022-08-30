/*
  Warnings:

  - A unique constraint covering the columns `[tool_id,type]` on the table `Payway` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payway_tool_id_type_key" ON "Payway"("tool_id", "type");
