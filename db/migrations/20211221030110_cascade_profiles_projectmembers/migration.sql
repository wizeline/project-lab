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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
