import { resolver, Ctx } from "blitz"
import db from "db"
import { UpdateVotes } from "app/projects/validations"
import { ProfileNotFoundError } from "app/auth/mutations/login"

export default resolver.pipe(
  resolver.zod(UpdateVotes),
  resolver.authorize(),
  async ({ id }, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()

    const project = await db.projects.update({
      where: { id },
      data: {
        votesCount: { increment: 1 },
        votes: {
          // create again
          create: [{ profileId: session.profileId }],
        },
      },
    })

    return project
  }
)
