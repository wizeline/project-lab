/*
  Warnings:

  - You are about to drop the column `votesCount` on the `Projects` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "valueStatement" TEXT,
    "target" TEXT,
    "demo" TEXT,
    "repoUrl" TEXT,
    "slackChannel" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT DEFAULT 'Idea Submitted',
    "categoryName" TEXT DEFAULT 'Experimenter',
    "positions" TEXT,
    "searchSkills" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE UNIQUE INDEX "Projects.name_unique" ON "Projects"("name");
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
CREATE INDEX "projects_isArchived_idx" ON "Projects"("isArchived");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
