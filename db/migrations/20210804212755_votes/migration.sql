-- CreateTable
CREATE TABLE "Vote" (
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "categoryName" TEXT NOT NULL DEFAULT 'Experiment',
    "positions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "status", "target", "updatedAt", "valueStatement") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "status", "target", "updatedAt", "valueStatement" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Vote.projectId_profileId_unique" ON "Vote"("projectId", "profileId");
