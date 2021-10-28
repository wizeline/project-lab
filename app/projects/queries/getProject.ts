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
        category: true,
        skills: true,
        labels: true,
        projectStatus: true,
        owner: true,
        projectMembers: {
          include: { profile: { select: { firstName: true, lastName: true } } },
          orderBy: [{ active: "desc" }, { role: "asc" }],
        },
        votes: { where: { profileId: session.profileId } },
        comments: {
          orderBy: [{ createdAt: "desc" }],
          include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        },
      },
    })

    if (!project) throw new NotFoundError()

    return project
  }
)
