import { resolver, NotFoundError, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetProject = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProject),
  resolver.authorize(),
  async ({ id }, { session }: Ctx) => {
    const project = await db.projects.findFirst({
      where: { id },
      include: {
        skills: true,
        disciplines: true,
        labels: true,
        projectStatus: true,
        owner: true,
        projectMembers: {
          include: {
            profile: { select: { firstName: true, lastName: true, email: true } },
            contributorPath: true,
            practicedSkills: true,
            role: true,
          },
          orderBy: [{ active: "desc" }],
        },
        stages: {
          include: {
            projectTasks: true,
          },
          orderBy: [{ position: "asc" }],
        },
        votes: { where: { projectId: id } },
        innovationTiers: true,
        repoUrls: true,
      },
    })

    if (!project) throw new NotFoundError()

    return project
  }
)
