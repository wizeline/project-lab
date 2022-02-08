import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"
import { validateIsTeamMember, ContributorPath } from "app/projects/validations"

const UpdateContributorPath = z.object({
  id: z.string(),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(z.object({ profileId: z.string() })),
  stages: ContributorPath,
})

export default resolver.pipe(
  resolver.zod(UpdateContributorPath),
  resolver.authorize(),
  async ({ id, owner, projectMembers, stages }, { session }: Ctx) => {
    //validate if the user have permissions (team member or owner of the project)
    validateIsTeamMember(session, { owner, projectMembers })

    for (let index = 0; index < stages.length; index++) {
      await db.projectStages.update({
        where: { id: stages[index]?.id },
        data: {
          name: stages[index]?.name,
          criteria: stages[index]?.criteria,
          mission: stages[index]?.mission,
          position: stages[index]?.position || 0,
        },
      })
    }

    return { id }
  }
)
