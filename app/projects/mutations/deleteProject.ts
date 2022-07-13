import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"
import { validateIsTeamMember } from "app/projects/validations"

const DeleteProject = z.object({
  id: z.string(),
})

export default resolver.pipe(
  resolver.zod(DeleteProject),
  resolver.authorize(),
  async ({ id, ...data }, { session }: Ctx) => {
    //validate if the user have permissions (team member or owner of the project)
    const project = await db.projects.findFirst({
      where: { id },
      include: {
        skills: true,
        disciplines: true,
        labels: true,
        projectStatus: true,
        owner: true,
        projectMembers: {
          include: { profile: { select: { firstName: true, lastName: true } } },
          orderBy: [{ active: "desc" }],
        },
      },
    })
    validateIsTeamMember(session, project)

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    await db.projects.deleteMany({ where: { id } })

    return project
  }
)
