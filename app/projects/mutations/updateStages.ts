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
      const stage = stages[index] ? stages[index] : null

      if (stage) {
        await db.projectStages.update({
          where: { id: stage.id },
          data: {
            name: stage.name,
            criteria: stage.criteria,
            mission: stage.mission,
            position: stage.position || 0,
            projectTasks: {
              upsert: stage.projectTasks.map((task) => ({
                where: { id: task.id },
                create: { description: task.description },
                update: { description: task.description },
              })),
            },
          },
          include: {
            projectTasks: true,
          },
        })
      }
    }

    return { id }
  }
)
