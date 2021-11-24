-- AlterTable
ALTER TABLE "Symptom" ADD COLUMN     "sessionId" INTEGER;

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "location" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;
