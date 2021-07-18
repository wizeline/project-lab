import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

export class ProfileNotFoundError extends Error {
  name = "ProfileNotFoundError"
  message = "There is no profile for current user."
}

const CreateProject = z.object({
  name: z.string(),
  description: z.string().optional(),
  valueStatement: z.string().optional(),
  target: z.string().optional(),
  demo: z.string().optional(),
  repoUrl: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(CreateProject),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    // TODO: use userId to get profileId
    if (!session.userId) return null

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
