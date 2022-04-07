/*
  Warnings:

  - You are about to drop the column `votesCount` on the `Projects` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_ProjectMembersToSkills" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "ProjectMembers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Skills" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "slackChannel" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT DEFAULT 'Idea Submitted',
    "categoryName" TEXT DEFAULT 'Experimenter',
    "positions" TEXT,
    "searchSkills" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectMembersToSkills_AB_unique" ON "_ProjectMembersToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectMembersToSkills_B_index" ON "_ProjectMembersToSkills"("B");
