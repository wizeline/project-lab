import { resolver, Ctx } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async ({ id, ...data }, { session }: Ctx) => {
  const comment = await db.comments.update({
    where: { id },
    data: {
      ...data,
    },
  })

  return comment
})
