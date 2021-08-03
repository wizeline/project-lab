import { paginate, resolver, Ctx } from "blitz"
import db, { Prisma } from "db"

export class ProfileNotFoundError extends Error {
  name = "ProfileNotFoundError"
  message = "There is no profile for current user."
}

interface GetProjectsInput
  extends Pick<Prisma.ProjectsFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetProjectsInput, { session }: Ctx) => {
    const result = await db.$queryRaw`SELECT p.id FROM Profiles p
    INNER JOIN User u ON u.email = p.email
    WHERE u.id = ${session.userId}`
    if (result.length != 1) throw new ProfileNotFoundError()

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: projects,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.projects.count({ where }),
      query: (paginateArgs) =>
        db.projects.findMany({
          ...paginateArgs,
          where: {
            ownerId: { equals: result[0].id },
          },
          orderBy,
        }),
    })

    return {
      projects,
      nextPage,
      hasMore,
      count,
    }
  }
)
