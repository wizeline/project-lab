import { resolver, Ctx } from "blitz"
import db from "db"
import { FullCreate } from "app/projects/validations"
import { defaultStatus, contributorPath } from "app/core/utils/constants"

export default resolver.pipe(
  resolver.zod(FullCreate),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const defaultTier = await db.innovationTiers.findFirst({
      select: { name: true },
      where: { defaultRow: true },
    })

    const { projectMembers, ...formInput } = input

    const project = await db.projects.create({
      data: {
        ...formInput,
        owner: { connect: { id: session.profileId } },
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
        repoUrls: {
          create: input.repoUrls,
        },
        innovationTiers: { connect: { name: input.innovationTiers?.name || defaultTier?.name } },
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

    // Loop Project Members
    for (let index = 0; index < projectMembers.length; index++) {
      // Creates the array for the roles connect
      const rolesArrayConnect = projectMembers[index].role?.map((r) => {
        return r.name === "Owner" ? { name: r.name } : { id: r.id }
      })
      await db.projectMembers.create({
        data: {
          project: { connect: { id: project.id } },
          profile: projectMembers[index].profile,
          hoursPerWeek: projectMembers[index].hoursPerWeek,
          mentees: projectMembers[index].mentees,
          role: { connect: rolesArrayConnect },
          practicedSkills: projectMembers[index].practicedSkills,
        },
      })
    }

    return project
  }
)
