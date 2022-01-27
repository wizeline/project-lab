import { resolver } from "blitz"
import db from "db"
import { CreateContributorPath } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateContributorPath),
  resolver.authorize(),
  async (input) => {
    await db.contributorPath.create({
      data: {
        projectMember: { connect: { id: input.projectMemberId } },
        projectTask: { connect: { id: input.projectTaskId } },
      },
    })
  }
)
