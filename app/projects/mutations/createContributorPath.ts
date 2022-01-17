import { resolver, Ctx } from "blitz"
import db from "db"
import { CreateContributorPath } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateContributorPath),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    await db.contributorPath.create({
      data: {
        projectMember: { connect: { id: input.projectMemberId } },
        projectTask: { connect: { id: input.taskId } },
      },
    })
  }
)
