import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"
import { defaultCategory, defaultStatus } from "app/core/utils/constants"

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const project = await db.projects.create({
      data: {
        ...input,
        owner: { connect: { id: session.profileId } },
        category: { connect: { name: input.category?.name || defaultCategory } },
        projectStatus: { connect: { name: input.projectStatus?.name || defaultStatus } },
        skills: {
          connect: input.skills,
        },
        labels: {
          connect: input.labels,
        },
        projectMembers: {
          create: input.projectMembers,
        },
      },
    })

    return project
  }
)
