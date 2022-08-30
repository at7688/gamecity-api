/*
  Warnings:

  - A unique constraint covering the columns `[tool_id,code]` on the table `Payway` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payway_tool_id_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payway_tool_id_code_key" ON "Payway"("tool_id", "code");
