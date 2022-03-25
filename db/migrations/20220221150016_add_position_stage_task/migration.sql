/*
  Warnings:

  - Added the required column `position` to the `ProjectTasks` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectTasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "projectStageId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("projectStageId") REFERENCES "ProjectStages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectTasks" ("createdAt", "description", "id", "projectStageId", "updatedAt") SELECT "createdAt", "description", "id", "projectStageId", "updatedAt" FROM "ProjectTasks";
DROP TABLE "ProjectTasks";
ALTER TABLE "new_ProjectTasks" RENAME TO "ProjectTasks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
