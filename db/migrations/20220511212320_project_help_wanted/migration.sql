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
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "tierName", "updatedAt", "valueStatement") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "tierName", "updatedAt", "valueStatement" FROM "Projects";
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

-- RedefineIndex
DROP INDEX "Disciplines.name_unique";
CREATE UNIQUE INDEX "Disciplines_name_key" ON "Disciplines"("name");

-- RedefineIndex
DROP INDEX "Labels.name_unique";
CREATE UNIQUE INDEX "Labels_name_key" ON "Labels"("name");

-- RedefineIndex
DROP INDEX "Locations.name_unique";
CREATE UNIQUE INDEX "Locations_name_key" ON "Locations"("name");

-- RedefineIndex
DROP INDEX "Profiles.email_unique";
CREATE UNIQUE INDEX "Profiles_email_key" ON "Profiles"("email");

-- RedefineIndex
DROP INDEX "project_members_project_id_profile_id_key";
CREATE UNIQUE INDEX "ProjectMembers_projectId_profileId_key" ON "ProjectMembers"("projectId", "profileId");

-- RedefineIndex
DROP INDEX "Session.handle_unique";
CREATE UNIQUE INDEX "Session_handle_key" ON "Session"("handle");

-- RedefineIndex
DROP INDEX "Token.hashedToken_type_unique";
CREATE UNIQUE INDEX "Token_hashedToken_type_key" ON "Token"("hashedToken", "type");

-- RedefineIndex
DROP INDEX "User.email_unique";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- RedefineIndex
DROP INDEX "Vote.projectId_profileId_unique";
CREATE UNIQUE INDEX "Vote_projectId_profileId_key" ON "Vote"("projectId", "profileId");
