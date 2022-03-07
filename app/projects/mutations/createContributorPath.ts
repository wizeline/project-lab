import { resolver } from "blitz"
import db from "db"
import { CreateContributorPath } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateContributorPath),
  resolver.authorize(),
  async ({ projectMemberId, projectTaskId, projectStageId }) => {
    await db.contributorPath.create({
      data: {
        projectMemberId,
        projectTaskId,
        projectStageId,
      },
    })
  }
)
