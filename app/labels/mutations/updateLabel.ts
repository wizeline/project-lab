import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateLabel = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateLabel),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const label = await db.labels.update({ where: { id }, data })

    return label
  }
)
