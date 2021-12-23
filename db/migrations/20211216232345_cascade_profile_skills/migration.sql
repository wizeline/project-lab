-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProfileSkills" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" TEXT,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("skillId") REFERENCES "Skills" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProfileSkills" ("id", "proficiency", "profileId", "skillId") SELECT "id", "proficiency", "profileId", "skillId" FROM "ProfileSkills";
DROP TABLE "ProfileSkills";
ALTER TABLE "new_ProfileSkills" RENAME TO "ProfileSkills";
CREATE INDEX "profile_skills_profile_id_idx" ON "ProfileSkills"("profileId");
CREATE INDEX "profile_skills_skill_id_idx" ON "ProfileSkills"("skillId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
