import { resolver, Ctx } from "blitz"
import db from "db"
import { CreateProjectMember } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(CreateProjectMember),
  resolver.authorize(),
  async (input, { session }: Ctx) => {
    const practicedSkillsArrayConnect = input.practicedSkills.map((skill) => {
      return { id: skill.id }
    })

    const rolesArrayConnect = input.role?.map((r) => ({ id: r.id }))

    const projectMember = await db.projectMembers.create({
      data: {
        project: { connect: { id: input.projectId } },
        profile: { connect: { id: session.profileId } },
        hoursPerWeek: input.hoursPerWeek,
        mentees: input.mentees,
        practicedSkills: { connect: practicedSkillsArrayConnect },
        role: { connect: rolesArrayConnect },
      },
    })
    return projectMember
  }
)
