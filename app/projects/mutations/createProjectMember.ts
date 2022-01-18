import { resolver, Ctx } from "blitz"
import db from "db"
import { CreateProjectMember } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateProjectMember),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const project = await db.projectMembers.create({
      data: {
        project: { connect: { id: input.projectId } },
        profile: { connect: { id: session.profileId } },
        hoursPerWeek: input.hoursPerWeek,
        role: input.role,
      },
    })
    return project
  }
)
