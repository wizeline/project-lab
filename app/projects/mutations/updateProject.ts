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
        projectMembers: {
          set: [],
          create: data.projectMembers,
        },
      },
      include: {
        skills: true,
        labels: true,
        projectMembers: { include: { profile: { select: { firstName: true, lastName: true } } } },
      },
    })

    return project
  }
)
