import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateLabel = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateLabel), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const label = await db.labels.create({ data: input })

  return label
})
