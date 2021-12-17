-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profiles" (
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
    FOREIGN KEY ("jobTitleId") REFERENCES "JobTitles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("locationId") REFERENCES "Locations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profiles" ("avatarUrl", "createdAt", "department", "email", "firstName", "id", "jobLevelTier", "jobLevelTitle", "jobTitleId", "lastName", "locationId", "searchCol", "terminatedAt", "updatedAt") SELECT "avatarUrl", "createdAt", "department", "email", "firstName", "id", "jobLevelTier", "jobLevelTitle", "jobTitleId", "lastName", "locationId", "searchCol", "terminatedAt", "updatedAt" FROM "Profiles";
DROP TABLE "Profiles";
ALTER TABLE "new_Profiles" RENAME TO "Profiles";
CREATE UNIQUE INDEX "Profiles.email_unique" ON "Profiles"("email");
CREATE INDEX "profiles_email_idx" ON "Profiles"("email");
CREATE INDEX "profiles_job_title_id_idx" ON "Profiles"("jobTitleId");
CREATE INDEX "profiles_location_id_idx" ON "Profiles"("locationId");
CREATE INDEX "profiles_search_col_idx" ON "Profiles"("searchCol");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
