import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteTier = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(DeleteTier), resolver.authorize(), async ({ name }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const tier = await db.innovationTiers.deleteMany({ where: { name } })

  return tier
})
