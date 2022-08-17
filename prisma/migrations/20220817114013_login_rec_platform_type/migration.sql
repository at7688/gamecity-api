/*
  Warnings:

  - Changed the type of `platform` on the `LoginRec` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('ADMIN', 'AGENT', 'PLAYER');

-- AlterTable
ALTER TABLE "LoginRec" DROP COLUMN "platform",
ADD COLUMN     "platform" "PlatformType" NOT NULL;
