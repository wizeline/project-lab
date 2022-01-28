import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetProjectMember = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProjectMember),
  resolver.authorize(),
  async ({ id }, { session }: Ctx) => {
    const projectMember = await db.projectMembers.findFirst({
      where: { profileId: session.profileId, projectId: id },
      include: {
        profile: true,
      },
    })

    return projectMember
  }
)
