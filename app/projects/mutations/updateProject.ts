import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateProject = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  valueStatement: z.string().optional().nullable(),
  target: z.string().optional().nullable(),
  demo: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  skills: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
})

export default resolver.pipe(
  resolver.zod(UpdateProject),
  resolver.authorize(),
  async ({ id, ...data }) => {
    console.log(data)
    const project = await db.projects.update({
      where: { id },
      data: {
        ...data,
        skills: {
          set: data.skills,
        },
      },
      include: { skills: true },
    })

    return project
  }
)
