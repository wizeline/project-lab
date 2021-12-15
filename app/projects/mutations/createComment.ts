import { resolver, Ctx } from "blitz"
import db from "db"
import { CreateComment } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateComment),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const comment = await db.comments.create({
      data: {
        projectId: input.projectId,
        authorId: session.profileId!,
        body: input.body,
      },
    })
    return comment
  }
)
