-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProfileSkills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" TEXT,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("skillId") REFERENCES "Skills" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProfileSkills" ("id", "proficiency", "profileId", "skillId") SELECT "id", "proficiency", "profileId", "skillId" FROM "ProfileSkills";
DROP TABLE "ProfileSkills";
ALTER TABLE "new_ProfileSkills" RENAME TO "ProfileSkills";
CREATE INDEX "profile_skills_profile_id_idx" ON "ProfileSkills"("profileId");
CREATE INDEX "profile_skills_skill_id_idx" ON "ProfileSkills"("skillId");
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
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "status", "target", "updatedAt", "valueStatement", "votesCount") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "status", "target", "updatedAt", "valueStatement", "votesCount" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE UNIQUE INDEX "Projects.name_unique" ON "Projects"("name");
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
CREATE TABLE "new_Comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "body" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("authorId") REFERENCES "Profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("parentId") REFERENCES "Comments" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("authorId", "body", "createdAt", "id", "parentId", "projectId", "updatedAt") SELECT "authorId", "body", "createdAt", "id", "parentId", "projectId", "updatedAt" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("createdAt", "expiresAt", "hashedToken", "id", "sentTo", "type", "updatedAt", "userId") SELECT "createdAt", "expiresAt", "hashedToken", "id", "sentTo", "type", "updatedAt", "userId" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");
CREATE TABLE "new_ProjectMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER,
    "role" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProjectMembers" ("active", "hoursPerWeek", "id", "profileId", "projectId", "role") SELECT "active", "hoursPerWeek", "id", "profileId", "projectId", "role" FROM "ProjectMembers";
DROP TABLE "ProjectMembers";
ALTER TABLE "new_ProjectMembers" RENAME TO "ProjectMembers";
CREATE UNIQUE INDEX "project_members_project_id_profile_id_key" ON "ProjectMembers"("projectId", "profileId");
CREATE INDEX "project_members_profile_id_idx" ON "ProjectMembers"("profileId");
CREATE INDEX "project_members_project_id_idx" ON "ProjectMembers"("projectId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
