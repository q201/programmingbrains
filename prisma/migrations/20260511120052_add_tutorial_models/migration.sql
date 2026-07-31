-- CreateTable
CREATE TABLE "public"."tutorial_tracks" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT,
    "totalDuration" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutorial_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tutorial_topics" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "duration" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFreePreview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutorial_topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutorial_tracks_slug_key" ON "public"."tutorial_tracks"("slug");

-- CreateIndex
CREATE INDEX "tutorial_tracks_published_sortOrder_idx" ON "public"."tutorial_tracks"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "tutorial_topics_trackId_sortOrder_idx" ON "public"."tutorial_topics"("trackId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."tutorial_tracks" ADD CONSTRAINT "tutorial_tracks_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tutorial_topics" ADD CONSTRAINT "tutorial_topics_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tutorial_tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
