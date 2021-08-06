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
    if (!session.profileId) throw new ProfileNotFoundError()

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
            ownerId: { equals: session.profileId },
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
