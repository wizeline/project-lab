-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OpportunityAreasSponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityAreaId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'active',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("opportunityAreaId") REFERENCES "OpportunityAreas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OpportunityAreasSponsor" ("active", "createdAt", "createdBy", "id", "opportunityAreaId", "profileId", "status") SELECT "active", "createdAt", "createdBy", "id", "opportunityAreaId", "profileId", "status" FROM "OpportunityAreasSponsor";
DROP TABLE "OpportunityAreasSponsor";
ALTER TABLE "new_OpportunityAreasSponsor" RENAME TO "OpportunityAreasSponsor";
CREATE INDEX "opportunity_areas_sponsor_profile_id_idx" ON "OpportunityAreasSponsor"("profileId");
CREATE INDEX "opportunity_areas_sponsor_opportunity_area_id_idx" ON "OpportunityAreasSponsor"("opportunityAreaId");
CREATE INDEX "opportunity_areas_sponsor_createdBy_idx" ON "OpportunityAreasSponsor"("createdBy");
CREATE UNIQUE INDEX "OpportunityAreasSponsor.opportunityAreaId_profileId_unique" ON "OpportunityAreasSponsor"("opportunityAreaId", "profileId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
