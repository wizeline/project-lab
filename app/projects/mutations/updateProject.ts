import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const project = await db.projects.update({ where: { id }, data })

    return project
  }
)
