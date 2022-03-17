import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const removeAdminRole = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(removeAdminRole),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const label = await db.user.update({ where: { id }, data: { role: "USER" } })

    return label
  }
)
