/*
  Warnings:

  - You are about to drop the `OpportunityAreas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OpportunityAreasSponsor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OpportunityAreasToProjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OpportunityAreas";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OpportunityAreasSponsor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OpportunityAreasToProjects";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Opportunity" (
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
CREATE TABLE "OpportunitySponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" TEXT DEFAULT 'active',
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("profileId") REFERENCES "Profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_OpportunityToProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "opportunity_areas_createdBy_idx" ON "Opportunity"("createdBy");

-- CreateIndex
CREATE INDEX "opportunity_areas_isArchived_idx" ON "Opportunity"("isArchived");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_profile_id_idx" ON "OpportunitySponsor"("profileId");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_opportunity_area_id_idx" ON "OpportunitySponsor"("opportunityId");

-- CreateIndex
CREATE INDEX "opportunity_areas_sponsor_createdBy_idx" ON "OpportunitySponsor"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "OpportunitySponsor.opportunityId_profileId_unique" ON "OpportunitySponsor"("opportunityId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "_OpportunityToProjects_AB_unique" ON "_OpportunityToProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_OpportunityToProjects_B_index" ON "_OpportunityToProjects"("B");
