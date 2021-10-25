import { resolver, Ctx } from "blitz"
import db from "db"
import { UpdateVotes } from "app/projects/validations"
import { ProfileNotFoundError } from "app/auth/mutations/login"

export default resolver.pipe(
  resolver.zod(UpdateVotes),
  resolver.authorize(),
  async ({ id, haveIVoted }, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()

    const sum = haveIVoted ? { decrement: 1 } : { increment: 1 }
    const votesAction = haveIVoted
      ? { deleteMany: [{ profileId: session.profileId }] }
      : { create: [{ profileId: session.profileId }] }

    const project = await db.projects.update({
      where: { id },
      data: {
        votesCount: sum,
        votes: votesAction,
      },
    })

    return project
  }
)
