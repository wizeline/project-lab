import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ category }: { category: string }) => {
  const { _count: count } = await db.projects.aggregate({
    _count: true,
    where: {
      categoryName: category,
    },
  })

  return count
})
