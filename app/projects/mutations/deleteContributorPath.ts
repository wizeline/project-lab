import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteContributorPath = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteContributorPath),
  resolver.authorize(),
  async ({ id }) => {
    const contributorPath = await db.contributorPath.deleteMany({ where: { id } })

    return contributorPath
  }
)
