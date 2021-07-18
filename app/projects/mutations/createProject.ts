import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateProject = z.object({
  name: z.string(),
  description: z.string().optional(),
  valueStatement: z.string().optional(),
  target: z.string().optional(),
  demo: z.string().optional(),
  repoUrl: z.string().optional(),
})

export default resolver.pipe(resolver.zod(CreateProject), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const project = await db.projects.create({ data: input })

  return project
})
