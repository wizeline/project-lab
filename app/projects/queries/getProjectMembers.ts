import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetProjectMembers = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProjectMembers),
  resolver.authorize(),
  async ({ id }, { session }: Ctx) => {
    const projectMembers = await db.projectMembers.findMany({
      where: { projectId: id },
      include: {
        profile: true,
        contributorPath: true,
      },
    })

    return projectMembers
  }
)
