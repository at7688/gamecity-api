-- CreateEnum
CREATE TYPE "GamePlatformStatus" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "ActivityPromo" (
    "id" TEXT NOT NULL,
    "pc_img" TEXT NOT NULL,
    "mb_img" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "sort" INTEGER NOT NULL,
    "start_at" TIMESTAMP,
    "end_at" TIMESTAMP,

    CONSTRAINT "ActivityPromo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "pc_img" TEXT NOT NULL,
    "mb_img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "sort" INTEGER NOT NULL,
    "start_at" TIMESTAMP,
    "end_at" TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlatform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "GamePlatformStatus" NOT NULL,
    "sort" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "GamePlatform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "sort" INTEGER NOT NULL,
    "platform_id" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GamePlatform_code_key" ON "GamePlatform"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Game_code_key" ON "Game"("code");

-- AddForeignKey
ALTER TABLE "GamePlatform" ADD CONSTRAINT "GamePlatform_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "GameCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "GamePlatform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
