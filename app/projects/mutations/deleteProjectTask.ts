import { resolver, Ctx } from "blitz"
import { z } from "zod"
import db from "db"
import { validateIsTeamMember } from "../validations"

const DeleteProjectTask = z.object({
  projectTaskId: z.string(),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(z.object({ profileId: z.string() })),
  isAdmin: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectTask),
  resolver.authorize(),
  async ({ projectTaskId, owner, projectMembers, isAdmin }, { session }: Ctx) => {
    if (!isAdmin) validateIsTeamMember(session, { owner, projectMembers })

    try {
      return await db.projectTasks.deleteMany({
        where: { id: projectTaskId },
      })
    } catch (error) {
      console.error(error)
    }
  }
)
