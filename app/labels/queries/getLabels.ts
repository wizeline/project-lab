import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetLabelsInput
  extends Pick<Prisma.LabelsFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetLabelsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: labels,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.labels.count({ where }),
      query: (paginateArgs) => db.labels.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      labels,
      nextPage,
      hasMore,
      count,
    }
  }
)
