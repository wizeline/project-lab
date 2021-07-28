import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteLabel = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteLabel), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const label = await db.label.deleteMany({ where: { id } })

  return label
})
