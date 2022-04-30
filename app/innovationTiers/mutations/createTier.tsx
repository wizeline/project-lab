import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateTier = z.object({
  name: z.string(),
  benefits: z.string(),
  requisites: z.string(),
  goals: z.string(),
})

export default resolver.pipe(resolver.zod(CreateTier), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const tier = await db.innovationTiers.create({ data: input })

  return tier
})
