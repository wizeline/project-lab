-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectStatus" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "color" TEXT NOT NULL DEFAULT '#1d1d1d'
);
INSERT INTO "new_ProjectStatus" ("name") SELECT "name" FROM "ProjectStatus";
DROP TABLE "ProjectStatus";
ALTER TABLE "new_ProjectStatus" RENAME TO "ProjectStatus";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
