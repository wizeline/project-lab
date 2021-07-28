import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetLabel = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetLabel), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const label = await db.label.findFirst({ where: { id } })

  if (!label) throw new NotFoundError()

  return label
})
