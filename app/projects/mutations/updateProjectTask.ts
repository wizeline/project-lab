import { resolver, Ctx } from "blitz"
import { z } from "zod"
import db from "db"
import { validateIsTeamMember } from "../validations"

const UpdateProjectTask = z.object({
  projectTasks: z.array(
    z.object({
      id: z.string(),
      position: z
        .string()
        .transform((val) => (val ? parseInt(val) : null))
        .or(z.number()),
    })
  ),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(z.object({ profileId: z.string() })),
  isAdmin: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateProjectTask),
  resolver.authorize(),
  async ({ projectTasks, owner, projectMembers, isAdmin }, { session }: Ctx) => {
    if (!isAdmin) validateIsTeamMember(session, { owner, projectMembers })

    for (let index = 0; index < projectTasks.length; index++) {
      const projectTask = projectTasks[index]
      if (projectTask) {
        await db.projectTasks.update({
          where: { id: projectTask.id },
          data: {
            position: projectTask.position || 0,
          },
        })
      }
    }
  }
)
