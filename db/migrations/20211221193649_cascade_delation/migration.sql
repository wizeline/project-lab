-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER,
    "role" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectMembers" ("active", "hoursPerWeek", "id", "profileId", "projectId", "role") SELECT "active", "hoursPerWeek", "id", "profileId", "projectId", "role" FROM "ProjectMembers";
DROP TABLE "ProjectMembers";
ALTER TABLE "new_ProjectMembers" RENAME TO "ProjectMembers";
CREATE UNIQUE INDEX "project_members_project_id_profile_id_key" ON "ProjectMembers"("projectId", "profileId");
CREATE INDEX "project_members_profile_id_idx" ON "ProjectMembers"("profileId");
CREATE INDEX "project_members_project_id_idx" ON "ProjectMembers"("projectId");
CREATE TABLE "new_Vote" (
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Vote" ("createdAt", "profileId", "projectId") SELECT "createdAt", "profileId", "projectId" FROM "Vote";
DROP TABLE "Vote";
ALTER TABLE "new_Vote" RENAME TO "Vote";
CREATE UNIQUE INDEX "Vote.projectId_profileId_unique" ON "Vote"("projectId", "profileId");
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
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "categoryName" TEXT NOT NULL DEFAULT 'Experiment',
    "positions" TEXT,
    "searchSkills" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement", "votesCount") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement", "votesCount" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE UNIQUE INDEX "Projects.name_unique" ON "Projects"("name");
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
