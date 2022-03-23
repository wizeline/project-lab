import { resolver, Ctx } from "blitz"
import { z } from "zod"
import db from "db"
import { validateIsTeamMember } from "../validations"

const DeleteProjectStage = z.object({
  stageId: z.string(),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(z.object({ profileId: z.string() })),
  isAdmin: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(DeleteProjectStage),
  resolver.authorize(),
  async ({ stageId, owner, projectMembers, isAdmin }, { session }: Ctx) => {
    if (!isAdmin) validateIsTeamMember(session, { owner, projectMembers })

    try {
      return await db.projectStages.deleteMany({
        where: { id: stageId },
      })
    } catch (error) {
      console.error(error)
    }
  }
)
