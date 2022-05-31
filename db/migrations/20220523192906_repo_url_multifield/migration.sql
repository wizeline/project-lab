/*
  Warnings:

  - You are about to drop the column `repoUrl` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `repoUrl` on the `ProjectsVersions` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Repos" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Repos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Repos" ( "url", "createdAt", "updatedAt", "projectId") SELECT "repoUrl", "createdAt", "updatedAt", "id"
from "Projects";

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
    "slackChannel" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT DEFAULT 'Idea Submitted',
    "categoryName" TEXT DEFAULT 'Experimenter',
    "tierName" TEXT DEFAULT 'Tier 3 (Experiment)',
    "positions" TEXT,
    "searchSkills" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "helpWanted" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Projects_status_fkey" FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Projects_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Projects_tierName_fkey" FOREIGN KEY ("tierName") REFERENCES "InnovationTiers" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "helpWanted", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "searchSkills", "slackChannel", "status", "target", "tierName", "updatedAt", "valueStatement") SELECT "categoryName", "createdAt", "demo", "description", "helpWanted", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "searchSkills", "slackChannel", "status", "target", "tierName", "updatedAt", "valueStatement" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE UNIQUE INDEX "Projects_name_key" ON "Projects"("name");
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
CREATE INDEX "projects_isArchived_idx" ON "Projects"("isArchived");
CREATE INDEX "projects_innovation_tier_idx" ON "Projects"("tierName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectsVersions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "valueStatement" TEXT,
    "target" TEXT,
    "demo" TEXT,
    "slackChannel" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT DEFAULT 'Idea Submitted',
    "categoryName" TEXT DEFAULT 'Experimenter',
    "positions" TEXT,
    "searchSkills" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ProjectsVersions_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectsVersions_status_fkey" FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProjectsVersions_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProjectsVersions" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "membersCount", "name", "ownerId", "positions", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement", "votesCount") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "membersCount", "name", "ownerId", "positions", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement", "votesCount" FROM "ProjectsVersions";
DROP TABLE "ProjectsVersions";
ALTER TABLE "new_ProjectsVersions" RENAME TO "ProjectsVersions";
CREATE INDEX "projects_version_owner_id_idx" ON "ProjectsVersions"("ownerId");
CREATE INDEX "projects_version_status_idx" ON "ProjectsVersions"("status");
CREATE INDEX "projects_version_category_idx" ON "ProjectsVersions"("categoryName");
CREATE INDEX "projects_version_isArchived_idx" ON "ProjectsVersions"("isArchived");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
