import { resolver } from "blitz"
import db from "db"
import { FullUpdate } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(FullUpdate),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const project = await db.projects.update({
      where: { id },
      data: {
        ...data,
        skills: {
          set: data.skills,
        },
        labels: {
          set: data.labels,
        },
      },
      include: { skills: true, labels: true },
    })

    return project
  }
)
