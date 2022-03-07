import { resolver } from "blitz"
import db from "db"
import { CreateContributorPath } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateContributorPath),
  resolver.authorize(),
  async (input) => {
    await db.contributorPath.create({
      data: {
        projectMemberId: input.projectMemberId,
        projectTaskId: input.projectTaskId,
        projectStageId: input.projectStageId,
      },
    })
  }
)
