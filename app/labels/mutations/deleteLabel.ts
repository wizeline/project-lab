import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteLabel = z.object({
  id: z.string(),
})

export default resolver.pipe(resolver.zod(DeleteLabel), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const label = await db.labels.deleteMany({ where: { id } })

  return label
})
