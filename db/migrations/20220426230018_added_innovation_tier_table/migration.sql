-- CreateTable
CREATE TABLE "InnovationTiers" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "benefits" TEXT NOT NULL,
    "requisites" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS innovation_tier_default_insert BEFORE INSERT ON "InnovationTiers"
BEGIN
  SELECT CASE
    WHEN
      ((SELECT "default" FROM "InnovationTiers" WHERE "default" = true) = NEW."default")
    THEN
      RAISE (FAIL, "default tier already exists")
  END;
END;

CREATE TRIGGER IF NOT EXISTS innovation_tier_default_update BEFORE UPDATE OF "default" ON "InnovationTiers"
BEGIN
  SELECT CASE
    WHEN
      (OLD."default" != true AND (SELECT "default" FROM "InnovationTiers" WHERE "default" = true) = NEW."default")
    THEN
      RAISE (FAIL, "default tier already exists")
  END;
END;

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
    FOREIGN KEY ("ownerId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("status") REFERENCES "ProjectStatus" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("categoryName") REFERENCES "Category" ("name") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("tierName") REFERENCES "InnovationTiers" ("name") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Projects" ("categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement") SELECT "categoryName", "createdAt", "demo", "description", "id", "isApproved", "isArchived", "logo", "name", "ownerId", "positions", "repoUrl", "searchSkills", "slackChannel", "status", "target", "updatedAt", "valueStatement" FROM "Projects";
DROP TABLE "Projects";
ALTER TABLE "new_Projects" RENAME TO "Projects";
CREATE UNIQUE INDEX "Projects.name_unique" ON "Projects"("name");
CREATE INDEX "projects_owner_id_idx" ON "Projects"("ownerId");
CREATE INDEX "projects_status_idx" ON "Projects"("status");
CREATE INDEX "projects_category_idx" ON "Projects"("categoryName");
CREATE INDEX "projects_isArchived_idx" ON "Projects"("isArchived");
CREATE INDEX "projects_innovation_tier_idx" ON "Projects"("tierName");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
