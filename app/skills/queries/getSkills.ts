import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetSkillsInput
  extends Pick<Prisma.SkillsFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSkillsInput) => {
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.skills.count({ where }),
      query: (paginateArgs) => db.skills.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      items,
      skills: items,
      nextPage,
      hasMore,
      count,
    }
  }
)
