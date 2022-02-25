import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProjectStatus = z.object({
  id: z.string(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateProjectStatus),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectStatus = await db.projectStatus.update({ where: { name: id }, data })

    return projectStatus
  }
)
