-- CreateTable
CREATE TABLE "Disciplines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "_DisciplinesToProjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Disciplines" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Disciplines.name_unique" ON "Disciplines"("name");

-- CreateIndex
CREATE INDEX "discipline_name_idx" ON "Disciplines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplinesToProjects_AB_unique" ON "_DisciplinesToProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplinesToProjects_B_index" ON "_DisciplinesToProjects"("B");
