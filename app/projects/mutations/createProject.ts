import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"
import { defaultCategory, defaultStatus, contributorPath } from "app/core/utils/constants"

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const project = await db.projects.create({
      data: {
        ...input,
        owner: { connect: { id: session.profileId } },
        category: { connect: { name: input.category?.name || defaultCategory } },
        projectStatus: { connect: { name: input.projectStatus?.name || defaultStatus } },
        skills: {
          connect: input.skills,
        },
        disciplines: {
          connect: input.disciplines,
        },
        labels: {
          connect: input.labels,
        },
        projectMembers: {
          create: input.projectMembers,
        },
      },
    })

    for (let i = 0; i < contributorPath?.length; i++) {
      const data = {
        name: contributorPath[i]?.name || "Failed",
        criteria: contributorPath[i]?.criteria || "Failed",
        mission: contributorPath[i]?.mission || "Failed",
      }
      const tasks = contributorPath[i]?.tasks || []
      const position = i + 1
      let projectTasks: any = []

      for (let j = 0; j < tasks.length; j++) {
        projectTasks.push({ description: tasks[j]?.name, position: tasks[j]?.position })
      }

      await db.projectStages.create({
        data: {
          ...data,
          project: { connect: { id: project.id } },
          position: position,
          projectTasks: {
            create: projectTasks,
          },
        },
      })
    }

    return project
  }
)
