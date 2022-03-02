import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"
import { validateIsTeamMember, ContributorPath } from "app/projects/validations"

const UpdateContributorPath = z.object({
  id: z.string(),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(z.object({ profileId: z.string() })),
  isAdmin: z.boolean(),
  stages: ContributorPath,
})

export default resolver.pipe(
  resolver.zod(UpdateContributorPath),
  resolver.authorize(),
  async ({ id, owner, projectMembers, isAdmin, stages }, { session }: Ctx) => {
    //validate if the user have permissions (team member or owner of the project)
    if (!isAdmin) validateIsTeamMember(session, { owner, projectMembers })

    for (let index = 0; index < stages.length; index++) {
      const stage = stages[index] ? stages[index] : null

      if (stage) {
        if (stage.isNewStage) {
          console.log("creating new stage")
          await db.projectStages.create({
            data: {
              name: stage.name,
              criteria: stage.criteria,
              mission: stage.mission,
              position: stage.position || 0,
              projectId: stage.projectId,
              projectTasks: {
                create: stage.projectTasks.map((task) => ({
                  description: task.description,
                  position: task.position || 0,
                })),
              },
            },
          })
        } else {
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
                  create: { description: task.description, position: task.position || 0 },
                  update: { description: task.description, position: task.position || 0 },
                })),
              },
            },
            include: {
              projectTasks: true,
            },
          })
        }
      }
    }

    return { id }
  }
)
