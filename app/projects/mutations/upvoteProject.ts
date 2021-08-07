import { resolver } from "blitz"
import db from "db"
import { UpdateVotes } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(UpdateVotes),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const project = await db.projects.update({
      where: { id },
      data: {
        ...data,
        votesCount: { increment: 1 },
        votes: {
          // create again
          create: data.votes,
        },
      },
    })

    return project
  }
)
