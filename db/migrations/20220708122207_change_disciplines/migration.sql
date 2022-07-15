/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectMembers` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "new_ProjectMembers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "hoursPerWeek" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO "new_ProjectMembers" ("id","createdAt", "updatedAt", "projectId", "profileId", "hoursPerWeek", "active") SELECT "id", "createdAt", "updatedAt", "projectId", "profileId", "hoursPerWeek", "active" FROM "ProjectMembers";

ALTER TABLE "ProjectMembers" RENAME TO "old_ProjectMembers";
ALTER TABLE "new_ProjectMembers" RENAME TO "ProjectMembers";

CREATE TABLE "_DisciplinesToProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplinesToProjectMembers_AB_unique" ON "_DisciplinesToProjectMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplinesToProjectMembers_B_index" ON "_DisciplinesToProjectMembers"("B");

-- AddForeignKey
ALTER TABLE "_DisciplinesToProjectMembers" ADD CONSTRAINT "_DisciplinesToProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplinesToProjectMembers" ADD CONSTRAINT "_DisciplinesToProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE OR REPLACE FUNCTION roles_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  UPDATE "ProjectMembersVersions"
  SET
    "updatedAt" = CURRENT_TIMESTAMP,
    "role" = (SELECT string_agg(_dpm."A", ',') FROM "_DisciplinesToProjectMembers" _dpm WHERE _dpm."B" = new."B")
  WHERE id = (
    SELECT v.id FROM "ProjectMembers" pm
    INNER JOIN "ProjectMembersVersions" v ON pm."profileId" = v."profileId" AND pm."projectId" = v."projectId"
    WHERE pm.id = new."B"
    ORDER BY v."createdAt" DESC LIMIT 1
  );
  RETURN NULL;
END;
$body$;

CREATE TRIGGER roles_versions_trigger
  AFTER INSERT OR UPDATE
  ON "_DisciplinesToProjectMembers"
  FOR EACH ROW
  EXECUTE FUNCTION roles_versions_fn();

-- Insert new Disciplines
INSERT INTO "Disciplines" VALUES
(md5(random()::text), 'Stakeholder'),
(md5(random()::text), 'Consultant')
ON CONFLICT do nothing;

-- Procedure to migrate old roles into the new table
CREATE TABLE temps (
  old_discipline TEXT,
  discipline TEXT
);

INSERT INTO temps VALUES
('Android developer', 'Android Engineer'),
('Android Developer', 'Android Engineer'),
('ANDROID DEVELOPER', 'Android Engineer'),
('Android Developer/Project Manager', 'Android Engineer'),
('Android Developer/Tech Lead', 'Android Engineer'),
('Android Develper', 'Android Engineer'),
('Android Engineer', 'Android Engineer'),
('Backend', 'Backend'),
('Backend Developer', 'Backend'),
('Backend Engineer', 'Backend'),
('Backend Engineer/co-leader', 'Backend'),
('Backend Engineer/ Reviewer', 'Backend'),
('Backend Engineer/Infrastructure', 'Backend'),
('Backend/Team Manager', 'Backend'),
('Backend / Unity Developer', 'Backend'),
('Business Stakeholder', 'Stakeholder'),
('Data Engineer', 'Data Engineer'),
('Data Scientist', 'Data Scientist'),
('Designer', 'UX Designer'),
('Devops', 'Site Reliability Engineer'),
('DevOps', 'Site Reliability Engineer'),
('FE Developer', 'Frontend'),
('Frontend', 'Frontend'),
('Frontend Developer', 'Frontend'),
('Front End Developer', 'Frontend'),
('Front-End Developer', 'Frontend'),
('Frontend Developer/React', 'Frontend'),
('Frontend Engineer/co-leader', 'Frontend'),
('Frontend / Unity Developer', 'Frontend'),
('Fullstack', 'Fullstack'),
('FullStack', 'Fullstack'),
(' FullStack', 'Fullstack'),
('Fullstack Developer', 'Fullstack'),
('Full Stack Engineer', 'Fullstack'),
('Functional QA Engineer III', 'Automation QA'),
('Infraestructure / Backend', 'Backend'),
('iOS', 'iOS Engineer'),
('iOS Developer', 'iOS Engineer'),
('iOS Developer/Backup Team Manager', 'iOS Engineer'),
('iOS Developer/Tech Lead', 'iOS Engineer'),
('iOS Engineer', 'iOS Engineer'),
('Owner', 'Owner'),
('PM', 'Project Manager'),
('Project Manager', 'Project Manager'),
('Product Manager', 'Product Manager'),
('QA', 'Automation QA'),
('QA Jr.', 'Automation QA'),
('SEE', 'Evolution Engineer'),
('Site Reliability Engineer', 'Site Reliability Engineer'),
('SRE', 'Site Reliability Engineer'),
('Tech Lead', 'Tech Lead'),
('Teach Lead', 'Tech Lead'),
('Tech Lead Frontend', 'Tech Lead'),
('Tech Lead QA', 'Tech Lead'),
('Tech Lead SRE', 'Tech Lead'),
('Team Manager', 'Tech Lead'),
('Technical Writer', 'Technical Writer'),
('Technical writer', 'Technical Writer'),
('Technical Writer ', 'Technical Writer'),
('UI/UX Designer', 'UX Designer'),
('UX', 'UX Designer'),
('UX designer', 'UX Designer'),
('Android Developer/Project Manager', 'Project Manager'),
('Android Developer/Tech Lead', 'Tech Lead'),
('Backend Engineer/co-leader', 'Tech Lead'),
('Backend Engineer/Infrastructure', 'Site Reliability Engineer'),
('Backend/Team Manager', 'Tech Lead'),
('Frontend Engineer/co-leader', 'Tech Lead'),
('Infraestructure / Backend', 'Site Reliability Engineer'),
('iOS Developer/Backup Team Manager', 'Tech Lead'),
('iOS Developer/Tech Lead', 'Tech Lead'),
('Developer', 'Fullstack'),
('Software Engineer', 'Fullstack'),
('Software Engineering', 'Fullstack'),
('SWE', 'Fullstack'),
('UI to YAML', 'Fullstack'),
('Unity Lead Developer', 'Fullstack'),
('Unity Lead Developer', 'Tech Lead'),
('VSCode Ext', 'Fullstack'),
('Web developer', 'Fullstack');

INSERT INTO "_DisciplinesToProjectMembers" SELECT d.id as "A", pm.id as "B" FROM "Disciplines" d
	INNER JOIN "temps" te ON d.name = te.discipline
	INNER JOIN "old_ProjectMembers" pm ON te.old_discipline = pm.role;

DROP TABLE IF EXISTS "temps";

-- Modify ProjectMembersVersions function
CREATE OR REPLACE FUNCTION project_members_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (old."projectId", old."profileId", 0, '', false, '');
  END IF;
  RETURN NULL;
END;
$body$;

/*
  Warnings:

  - You are about to drop the `old_ProjectMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[projectId,profileId]` on the table `ProjectMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ContributorPath" DROP CONSTRAINT "ContributorPath_projectMemberId_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectMembersToSkills" DROP CONSTRAINT "_ProjectMembersToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "old_ProjectMembers" DROP CONSTRAINT "ProjectMembers_profileId_fkey";

-- DropForeignKey
ALTER TABLE "old_ProjectMembers" DROP CONSTRAINT "ProjectMembers_projectId_fkey";

-- AlterTable
ALTER TABLE "old_ProjectMembers" DROP CONSTRAINT "ProjectMembers_pkey";

ALTER TABLE "ProjectMembers" RENAME CONSTRAINT "new_ProjectMembers_pkey" TO "ProjectMembers_pkey";

-- DropTable
DROP TABLE "old_ProjectMembers";

-- CreateIndex
CREATE INDEX "project_members_profile_id_idx" ON "ProjectMembers"("profileId");

-- CreateIndex
CREATE INDEX "project_members_project_id_idx" ON "ProjectMembers"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMembers_projectId_profileId_key" ON "ProjectMembers"("projectId", "profileId");

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembers" ADD CONSTRAINT "ProjectMembers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributorPath" ADD CONSTRAINT "ContributorPath_projectMemberId_fkey" FOREIGN KEY ("projectMemberId") REFERENCES "ProjectMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectMembersToSkills" ADD CONSTRAINT "_ProjectMembersToSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "ProjectMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;