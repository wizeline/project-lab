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
    const projectQueried = await db.projects.findFirst({
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
        relatedProjectsA: {
          include: {
            projectA: { select: { id: true, name: true } },
            projectB: { select: { id: true, name: true } },
          },
        },
        relatedProjectsB: {
          include: {
            projectA: { select: { id: true, name: true } },
            projectB: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!projectQueried) throw new NotFoundError()

    // Parse related Projects
    const relatedProA = projectQueried.relatedProjectsA.map((e) => {
      return e.projectA.id === id ? { ...e.projectB } : { ...e.projectA }
    })
    const relatedProB = projectQueried.relatedProjectsB.map((e) => {
      return e.projectA.id === id ? { ...e.projectB } : { ...e.projectA }
    })
    const relatedProjects = { relatedProA, relatedProB }

    const project = {
      ...projectQueried,
      relatedProjects: [...relatedProA, ...relatedProB],
    }
    return project
  }
)
