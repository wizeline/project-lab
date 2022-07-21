import { resolver, Ctx, useQuery } from "blitz"
import db from "db"
import { FullUpdate, validateIsTeamMember } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(FullUpdate),
  resolver.authorize(),
  async ({ id, isAdmin, ...data }, { session }: Ctx) => {
    //validate if the user have permissions (team member or owner of the project)
    if (!isAdmin) validateIsTeamMember(session, data)

    let activeMembers: any = []

    // Loop Project Members
    for (let index = 0; index < data.projectMembers.length; index++) {
      // Creates the array for the practicedSkills connect
      const practicedSkillsArrayConnect = data.projectMembers[index].practicedSkills?.map(
        (skill) => {
          return { id: skill.id }
        }
      )
      // Creates the array for the roles connect
      const rolesArrayConnect = data.projectMembers[index].role?.map((r) => {
        return { id: r.id }
      })
      // Create only the members that don't exist in this project
      if (data.projectMembers[index].profile) {
        activeMembers.push(data.projectMembers[index]?.id)
        // Just disconnects ALL related practicedSkills and roles, so it can UPDATE just the new selected ones after...
        await db.projectMembers.update({
          where: { id: data.projectMembers[index].id },
          data: {
            practicedSkills: { set: [] },
            role: { set: [] },
          },
          include: {
            practicedSkills: true,
            role: true,
          },
        })
        // Makes all the actual updates to the projectMember
        await db.projectMembers.update({
          where: { id: data.projectMembers[index].id },
          data: {
            hoursPerWeek: data.projectMembers[index].hoursPerWeek,
            mentees: data.projectMembers[index].mentees,
            role: { connect: rolesArrayConnect },
            active: data.projectMembers[index].active,
            practicedSkills: { connect: practicedSkillsArrayConnect },
          },
          include: {
            practicedSkills: true,
          },
        })
      } else {
        await db.projectMembers.create({
          data: {
            project: { connect: { id } },
            profile: { connect: { id: data.projectMembers[index].profileId } },
            hoursPerWeek: data.projectMembers[index].hoursPerWeek,
            mentees: data.projectMembers[index].mentees,
            role: { connect: rolesArrayConnect },
            practicedSkills: { connect: practicedSkillsArrayConnect },
          },
        })
      }
    }

    // Delete members who are no longer active
    for (let j = 0; j < data.existedMembers?.length; j++) {
      if (!activeMembers.includes(data.existedMembers[j])) {
        await db.projectMembers.deleteMany({ where: { id: data.existedMembers[j] } })
      }
    }

    // Update RepoUrls
    const projectRepoUrls = await db.repos.findMany({
      where: { projectId: id },
    })

    for (let i = 0; i < projectRepoUrls.length; i++) {
      if (!data.repoUrls.find((repo) => repo.id === projectRepoUrls[i]?.id)) {
        await db.repos.delete({ where: { id: projectRepoUrls[i]?.id } })
      }
    }

    const newRepos = data.repoUrls.filter(
      (repo) => !projectRepoUrls.find((repoUrl) => repoUrl.id === repo.id)
    )

    // Delete from Form values because We already updated the project members.
    delete data.projectMembers
    delete data.existedMembers

    const project = await db.projects.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        projectStatus: { connect: { name: data.projectStatus?.name } },
        owner: { connect: { id: data.owner?.id } },
        skills: {
          set: data.skills,
        },
        disciplines: {
          set: data.disciplines,
        },
        labels: {
          set: data.labels,
        },
        repoUrls: {
          create: newRepos,
        },
        innovationTiers: { connect: { name: data.innovationTiers?.name } },
      },
      include: {
        projectStatus: true,
        skills: true,
        disciplines: true,
        labels: true,
        repoUrls: true,
        owner: true,
        stages: {
          include: {
            projectTasks: true,
          },
        },
        projectMembers: {
          include: {
            profile: { select: { firstName: true, lastName: true, email: true } },
            role: true,
            contributorPath: true,
            practicedSkills: true,
          },
        },
        votes: { where: { profileId: session.profileId } },
        innovationTiers: true,
      },
    })

    return project
  }
)
