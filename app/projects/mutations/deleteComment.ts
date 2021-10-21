import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteComment = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(DeleteComment), resolver.authorize(), async ({ id }) => {
  const comment = await db.comments.deleteMany({ where: { id } })

  return comment
})
