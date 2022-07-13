/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "role";

-- CreateTable
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
