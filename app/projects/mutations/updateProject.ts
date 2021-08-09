import { resolver, Ctx } from "blitz"
import db from "db"
import { FullUpdate } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(FullUpdate),
  resolver.authorize(),
  async ({ id, ...data }, { session }: Ctx) => {
    // first delete all project members for project id
    await db.projectMembers.deleteMany({
      where: { projectId: id },
    })
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
          // create again
          create: data.projectMembers,
        },
      },
      include: {
        skills: true,
        labels: true,
        projectMembers: { include: { profile: { select: { firstName: true, lastName: true } } } },
        votes: { where: { profileId: session.profileId } },
      },
    })

    return project
  }
)
