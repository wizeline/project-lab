import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"

export class ProfileNotFoundError extends Error {
  name = "ProfileNotFoundError"
  message = "There is no profile for current user."
}

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()

    const project = await db.projects.create({
      data: {
        ...input,
        owner: { connect: { id: session.profileId } },
        skills: {
          connect: input.skills,
        },
        labels: {
          connect: input.labels,
        },
        projectMembers: {
          create: input.projectMembers,
        },
      },
    })

    return project
  }
)
