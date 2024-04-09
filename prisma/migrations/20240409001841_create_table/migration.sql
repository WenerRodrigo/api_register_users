/*
  Warnings:

  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "event";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
