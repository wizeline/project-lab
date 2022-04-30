import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTiersInput
  extends Pick<Prisma.InnovationTiersFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTiersInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: tiers,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.innovationTiers.count({ where }),
      query: (paginateArgs) => db.innovationTiers.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      tiers,
      nextPage,
      hasMore,
      count,
    }
  }
)
