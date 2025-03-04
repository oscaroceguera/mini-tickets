/*
  Warnings:

  - You are about to drop the column `userId` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checkoutSessionId" TEXT NOT NULL,
    "ticketTypeSale" TEXT NOT NULL,
    "buyer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Order" ("buyer", "checkoutSessionId", "createdAt", "id", "ticketTypeSale", "updatedAt") SELECT "buyer", "checkoutSessionId", "createdAt", "id", "ticketTypeSale", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_checkoutSessionId_key" ON "Order"("checkoutSessionId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullname" TEXT,
    "email" TEXT NOT NULL,
    "country" TEXT,
    "shareDataAgree" BOOLEAN NOT NULL DEFAULT true,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("country", "createdAt", "email", "fullname", "id", "shareDataAgree", "updatedAt") SELECT "country", "createdAt", "email", "fullname", "id", "shareDataAgree", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
