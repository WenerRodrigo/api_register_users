-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");
