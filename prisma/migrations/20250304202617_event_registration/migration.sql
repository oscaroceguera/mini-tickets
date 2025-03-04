/*
  Warnings:

  - Added the required column `event` to the `RegistrationSheet` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RegistrationSheet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "registeredDay1" BOOLEAN NOT NULL DEFAULT false,
    "registeredDay2" BOOLEAN NOT NULL DEFAULT false,
    "ticketId" TEXT NOT NULL,
    "event" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RegistrationSheet_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RegistrationSheet" ("createdAt", "id", "registeredDay1", "registeredDay2", "ticketId", "updatedAt") SELECT "createdAt", "id", "registeredDay1", "registeredDay2", "ticketId", "updatedAt" FROM "RegistrationSheet";
DROP TABLE "RegistrationSheet";
ALTER TABLE "new_RegistrationSheet" RENAME TO "RegistrationSheet";
CREATE UNIQUE INDEX "RegistrationSheet_ticketId_key" ON "RegistrationSheet"("ticketId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
