-- AlterTable
ALTER TABLE "ProjectMembers" ADD COLUMN     "mentees" INTEGER DEFAULT 1;

-- CreateTable
CREATE TABLE "Mentorships" (
    "id" SERIAL NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentorships_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Mentorships" ADD CONSTRAINT "Mentorships_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorships" ADD CONSTRAINT "Mentorships_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorships" ADD CONSTRAINT "Mentorships_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
