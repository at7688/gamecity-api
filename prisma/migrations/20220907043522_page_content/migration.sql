-- CreateTable
CREATE TABLE "PageContent" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("code")
);
