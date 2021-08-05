import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"

export class SessionNotFoundError extends Error {
  name = "SessionNotFoundError"
  message = "There is no profile for current user."
}

export class ProfileNotFoundError extends Error {
  name = "ProfileNotFoundError"
  message = "There is no profile for current user."
}

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    // TODO: use userId to get profileId
    if (!session.userId) throw new SessionNotFoundError()

    const result = await db.$queryRaw`SELECT p.id FROM Profiles p
      INNER JOIN User u ON u.email = p.email
      WHERE u.id = ${session.userId}`
    if (result.length != 1) throw new ProfileNotFoundError()

    const project = await db.projects.create({
      data: {
        ...input,
        owner: { connect: { id: result[0].id } },
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
