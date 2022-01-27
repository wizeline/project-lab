import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const getContributorPath = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(getContributorPath),
  resolver.authorize(),
  async ({ id }, { session }: Ctx) => {
    const contributorPath = await db.contributorPath.findMany({
      where: { projectMemberId: id },
    })

    if (!contributorPath) return []

    return contributorPath
  }
)
