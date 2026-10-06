/*
  Warnings:

  - Existing Student rows will receive their current id as a temporary sequenceNumber.
  - A unique constraint covering the columns [eventId,sequenceNumber] on the table Student will be added.
*/

-- AlterTable
ALTER TABLE "Student"
ADD COLUMN "isAbsent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sequenceNumber" INTEGER;

-- Give existing development data a temporary sequence number.
-- Real imported data will use the actual podium sequence number.
UPDATE "Student"
SET "sequenceNumber" = "id";

-- sequenceNumber is required after existing rows have been populated.
ALTER TABLE "Student"
ALTER COLUMN "sequenceNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_eventId_sequenceNumber_key"
ON "Student"("eventId", "sequenceNumber");