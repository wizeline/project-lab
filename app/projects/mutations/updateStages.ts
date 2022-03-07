import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"
import { validateIsTeamMember, ContributorPath } from "app/projects/validations"

const UpdateContributorPath = z.object({
  id: z.string(),
  owner: z.object({ id: z.string() }),
  projectMembers: z.array(
    z.object({
      id: z.string(),
      profileId: z.string(),
      contributorPath: z.array(
        z.object({
          id: z.string(),
          projectTaskId: z.string(),
          projectMemberId: z.string(),
          projectStageId: z.string(),
        })
      ),
    })
  ),
  isAdmin: z.boolean(),
  stages: ContributorPath,
})

export default resolver.pipe(
  resolver.zod(UpdateContributorPath),
  resolver.authorize(),
  ({ id, owner, projectMembers, isAdmin, stages }, { session }: Ctx) => {
    if (!isAdmin) validateIsTeamMember(session, { owner, projectMembers })

    // Update stages
    stages.map(async (stage) => {
      if (stage.isNewStage) {
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
    })

    // ammend contributor's path if stages position change
    let stagesCompleted = {}
    stages.map(({ position: _position_, projectTasks }) => {
      const position = _position_ ?? 0
      return (stagesCompleted[position] = {
        tasksTotal: projectTasks.length,
        membersCompleted: {},
      })
    })
    stages.map(({ projectTasks, position: _position_ }) => {
      const position = _position_ ?? 0
      return projectTasks.map(({ id: taskId }) =>
        projectMembers.map(({ contributorPath }) =>
          contributorPath.map(({ projectTaskId, projectMemberId }) => {
            if (projectTaskId === taskId) {
              stagesCompleted[position].membersCompleted[projectMemberId]
                ? ++stagesCompleted[position].membersCompleted[projectMemberId]
                : (stagesCompleted[position].membersCompleted[projectMemberId] = 1)
            }
          })
        )
      )
    })
    projectMembers.map(({ id: projectMemberId }) => {
      let subsequentStageCompleted = false
      for (let index = stages.length; index > 0; --index) {
        const { tasksTotal, membersCompleted } = stagesCompleted[index]
        if (membersCompleted[projectMemberId]) {
          if (membersCompleted[projectMemberId] === tasksTotal) {
            subsequentStageCompleted = true
          } else if (subsequentStageCompleted) {
            completeTaskToMember(stages, index, projectMemberId)
          }
        } else if (subsequentStageCompleted) {
          completeTaskToMember(stages, index, projectMemberId)
        }
      }
    })

    function completeTaskToMember(stages, index, projectMemberId) {
      const [stage] = stages.filter(({ position }) => position === index)
      if (stage) {
        stage.projectTasks.map(async (projectTasks) => {
          await db.contributorPath.create({
            data: {
              projectMemberId: projectMemberId || "",
              projectTaskId: projectTasks.id || "",
              projectStageId: stage.id || "",
            },
          })
        })
      }
    }

    return { id }
  }
)
