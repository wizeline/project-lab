import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCategory = z.object({
  // id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateCategory),
  resolver.authorize(),
  async ({ name, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const category = await db.category.update({ where: { name }, data })

    return category
  }
)
