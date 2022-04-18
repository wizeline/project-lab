-- CreateTable
CREATE TABLE "ProjectMembersVersions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER,
    "role" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "practicedSkills" TEXT,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("projectId") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectsVersions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "membersCount" INTEGER NOT NULL DEFAULT 0,
    "votesCount" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
CREATE INDEX "project_members_profile_id_idx" ON "ProjectMembers"("profileId");
CREATE INDEX "project_members_project_id_idx" ON "ProjectMembers"("projectId");
CREATE UNIQUE INDEX "project_members_project_id_profile_id_key" ON "ProjectMembers"("projectId", "profileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE INDEX "project_members_v_project_id_profile_id_key" ON "ProjectMembersVersions"("projectId", "profileId");

-- CreateIndex
CREATE INDEX "project_members_v_profile_id_idx" ON "ProjectMembersVersions"("profileId");

-- CreateIndex
CREATE INDEX "project_members_v_project_id_idx" ON "ProjectMembersVersions"("projectId");

-- CreateIndex
CREATE INDEX "projects_version_owner_id_idx" ON "ProjectsVersions"("ownerId");

-- CreateIndex
CREATE INDEX "projects_version_status_idx" ON "ProjectsVersions"("status");

-- CreateIndex
CREATE INDEX "projects_version_category_idx" ON "ProjectsVersions"("categoryName");

-- CreateIndex
CREATE INDEX "projects_version_isArchived_idx" ON "ProjectsVersions"("isArchived");

--- Manually added for ProjectsVersions
CREATE TRIGGER IF NOT EXISTS "projects_v_insert" AFTER INSERT ON "Projects" BEGIN
    INSERT INTO "ProjectsVersions" ("ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "repoUrl", "slackChannel", "isApproved", "status", "categoryName", "positions", "searchSkills", "isArchived",
      "membersCount", "votesCount")
    VALUES (NEW.ownerId, NEW.name, NEW.logo, NEW.description, NEW.valueStatement, NEW.target, NEW.demo, NEW.repoUrl, NEW.slackChannel, NEW.isApproved, NEW.status, NEW.categoryName, NEW.positions, NEW.searchSkills, NEW.isArchived,
      (SELECT COUNT(*) FROM ProjectMembers WHERE ProjectMembers.projectId = NEW.id),
      (SELECT COUNT(*) FROM Vote WHERE Vote.projectId = NEW.id)
    );
END;

CREATE TRIGGER IF NOT EXISTS "projects_v_update" AFTER UPDATE ON "Projects" BEGIN
    INSERT INTO "ProjectsVersions" ("ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "repoUrl", "slackChannel", "isApproved", "status", "categoryName", "positions", "searchSkills", "isArchived",
      "membersCount", "votesCount")
    VALUES (NEW.ownerId, NEW.name, NEW.logo, NEW.description, NEW.valueStatement, NEW.target, NEW.demo, NEW.repoUrl, NEW.slackChannel, NEW.isApproved, NEW.status, NEW.categoryName, NEW.positions, NEW.searchSkills, NEW.isArchived,
      (SELECT COUNT(*) FROM ProjectMembers WHERE ProjectMembers.projectId = NEW.id),
      (SELECT COUNT(*) FROM Vote WHERE Vote.projectId = NEW.id)
    );
END;

CREATE TRIGGER IF NOT EXISTS "projects_v_delete" AFTER DELETE ON "Projects" BEGIN
    INSERT INTO "ProjectsVersions" ("ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "repoUrl", "slackChannel", "isApproved", "status", "categoryName", "positions", "searchSkills", "isArchived",
      "membersCount", "votesCount")
    VALUES (OLD.ownerId, OLD.name, OLD.logo, OLD.description, OLD.valueStatement, OLD.target, OLD.demo, OLD.repoUrl, OLD.slackChannel, OLD.isApproved, OLD.status, OLD.categoryName, OLD.positions, OLD.searchSkills, OLD.isArchived,
      0,
      0
    );
END;

--- Manually added for ProjectMembersVersions
CREATE TRIGGER IF NOT EXISTS "project_members_v_insert" AFTER INSERT ON "ProjectMembers" BEGIN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (new.projectId, new.profileId, new.hoursPerWeek, new.role, new.active, "");
END;

CREATE TRIGGER IF NOT EXISTS "project_members_v_update" AFTER UPDATE ON "ProjectMembers" BEGIN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (new.projectId, new.profileId, new.hoursPerWeek, new.role, new.active, "");
END;

CREATE TRIGGER IF NOT EXISTS "project_members_v_delete" AFTER DELETE ON "ProjectMembers" BEGIN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (old.projectId, old.profileId, 0, "", false, "");
END;

--- Manually update practicedSkills field
CREATE TRIGGER IF NOT EXISTS "practiced_skills_v_insert" AFTER INSERT ON "_ProjectMembersToSkills" BEGIN
    UPDATE "ProjectMembersVersions"
    SET
      "updatedAt" = CURRENT_TIMESTAMP,
      "practicedSkills" = (SELECT GROUP_CONCAT("B") FROM "_ProjectMembersToSkills" WHERE "A" = new.A)
    WHERE id = (
      SELECT v.id FROM ProjectMembers pm
      INNER JOIN ProjectMembersVersions v ON pm.profileId = v.profileId AND pm.projectId = v.projectId
      WHERE pm.id = new.A
      ORDER BY v.createdAt DESC LIMIT 1
    );
END;

CREATE TRIGGER IF NOT EXISTS "practiced_skills_v_update" AFTER UPDATE ON "_ProjectMembersToSkills" BEGIN
    UPDATE "ProjectMembersVersions"
    SET
      "updatedAt" = CURRENT_TIMESTAMP,
      "practicedSkills" = (SELECT GROUP_CONCAT("B") FROM "_ProjectMembersToSkills" WHERE "A" = new.A)
    WHERE id = (
      SELECT v.id FROM ProjectMembers pm
      INNER JOIN ProjectMembersVersions v ON pm.profileId = v.profileId AND pm.projectId = v.projectId
      WHERE pm.id = new.A
      ORDER BY v.createdAt DESC LIMIT 1
    );
END;
