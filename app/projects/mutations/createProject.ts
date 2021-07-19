import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

export class SessionNotFoundError extends Error {
  name = "SessionNotFoundError"
  message = "There is no profile for current user."
}

export class ProfileNotFoundError extends Error {
  name = "ProfileNotFoundError"
  message = "There is no profile for current user."
}

const CreateProject = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  valueStatement: z.string().optional().nullable(),
  target: z.string().optional().nullable(),
  demo: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
})

export default resolver.pipe(
  resolver.zod(CreateProject),
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
        ownerId: result[0].id,
        ...input,
      },
    })

    return project
  }
)
