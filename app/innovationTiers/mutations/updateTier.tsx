import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateTier = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateTier),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const tier = await db.innovationTiers.update({ where: { name: id }, data })

    return tier
  }
)
