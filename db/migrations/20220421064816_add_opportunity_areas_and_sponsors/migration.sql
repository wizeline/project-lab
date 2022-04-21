-- CreateTable
CREATE TABLE "OpportunityAreas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creator" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "OpportunityAreasSponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityAreaId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("opportunityAreaId") REFERENCES "OpportunityAreas" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OpportunityAreasToProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "OpportunityAreas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "opportunity_areas_createdBy_idx" ON "OpportunityAreas"("createdBy");

-- CreateIndex
CREATE INDEX "opportunity_areas_isArchived_idx" ON "OpportunityAreas"("isArchived");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_profile_id_idx" ON "OpportunityAreasSponsor"("profileId");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_opportunity_area_id_idx" ON "OpportunityAreasSponsor"("opportunityAreaId");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_createdBy_idx" ON "OpportunityAreasSponsor"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunityAreasSponsor.opportunityAreaId_profileId_unique" ON "OpportunityAreasSponsor"("opportunityAreaId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "_OpportunityAreasToProjects_AB_unique" ON "_OpportunityAreasToProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_OpportunityAreasToProjects_B_index" ON "_OpportunityAreasToProjects"("B");
