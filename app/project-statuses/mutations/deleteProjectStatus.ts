import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteProjectStatus = z.object({
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectStatus),
  resolver.authorize(),
  async ({ name }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const projectStatus = await db.projectStatus.deleteMany({ where: { name: name } })

    return projectStatus
  }
)
