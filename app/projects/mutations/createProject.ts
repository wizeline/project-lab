import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const project = await db.projects.create({
      data: {
        ...input,
        owner: { connect: { id: session.profileId } },
        category: { connect: { name: input.category?.name } },
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
