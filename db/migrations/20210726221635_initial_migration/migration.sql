-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME,
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" INTEGER,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JobTitles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "nameAbbreviation" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ProfileSkills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" TEXT,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("skillId") REFERENCES "Skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "searchCol" TEXT,
    "avatarUrl" TEXT,
    "locationId" TEXT,
    "jobTitleId" TEXT,
    "jobLevelTier" TEXT,
    "jobLevelTitle" TEXT,
    "department" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "terminatedAt" DATETIME,
    FOREIGN KEY ("jobTitleId") REFERENCES "JobTitles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("locationId") REFERENCES "Locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER,
    "role" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectStatus" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Projects" (
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
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Skills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Labels" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_ProjectsToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_LabelsToProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Labels" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Locations.name_unique" ON "Locations"("name");

-- CreateIndex
CREATE INDEX "profile_skills_profile_id_idx" ON "ProfileSkills"("profileId");

-- CreateIndex
CREATE INDEX "profile_skills_skill_id_idx" ON "ProfileSkills"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles.email_unique" ON "Profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_email_idx" ON "Profiles"("email");

-- CreateIndex
CREATE INDEX "profiles_job_title_id_idx" ON "Profiles"("jobTitleId");

-- CreateIndex
CREATE INDEX "profiles_location_id_idx" ON "Profiles"("locationId");

-- CreateIndex
CREATE INDEX "profiles_search_col_idx" ON "Profiles"("searchCol");

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_profile_id_key" ON "ProjectMembers"("projectId", "profileId");

-- CreateIndex
CREATE INDEX "project_members_profile_id_idx" ON "ProjectMembers"("profileId");

-- CreateIndex
CREATE INDEX "project_members_project_id_idx" ON "ProjectMembers"("projectId");

-- CreateIndex
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "Projects"("status");

-- CreateIndex
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Skills.name_unique" ON "Skills"("name");

-- CreateIndex
CREATE INDEX "skills_name_idx" ON "Skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Labels.name_unique" ON "Labels"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectsToSkills_AB_unique" ON "_ProjectsToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectsToSkills_B_index" ON "_ProjectsToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LabelsToProjects_AB_unique" ON "_LabelsToProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelsToProjects_B_index" ON "_LabelsToProjects"("B");
