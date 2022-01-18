import { resolver, Ctx, useQuery } from "blitz"
import db from "db"
import { FullUpdate, validateIsTeamMember } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(FullUpdate),
  resolver.authorize(),
  async ({ id, ...data }, { session }: Ctx) => {
    //validate if the user have permissions (team member or owner of the project)
    validateIsTeamMember(session, data)

    let activeMembers: any = []

    // Loop Project Members
    for (let index = 0; index < data.projectMembers.length; index++) {
      // Create only the members that don't exist in this project
      if (data.projectMembers[index].profile) {
        activeMembers.push(data.projectMembers[index]?.id)
        await db.projectMembers.update({
          where: { id: data.projectMembers[index].id },
          data: {
            hoursPerWeek: data.projectMembers[index].hoursPerWeek,
            role: data.projectMembers[index].role,
            active: data.projectMembers[index].active,
          },
        })
      } else {
        await db.projectMembers.create({
          data: {
            project: { connect: { id } },
            profile: { connect: { id: data.projectMembers[index].profileId } },
            hoursPerWeek: data.projectMembers[index].hoursPerWeek,
            role: data.projectMembers[index].role,
          },
        })
      }
    }

    // Delete members who are no longer active
    for (let j = 0; j < data.existedMembers?.length; j++) {
      if (activeMembers.indexOf(data.existedMembers[j]) == -1) {
        await db.projectMembers.deleteMany({ where: { id: data.existedMembers[j] } })
      }
    }

    // Delete from Form values because We already updated the project members.
    delete data.projectMembers
    delete data.existedMembers

    const project = await db.projects.update({
      where: { id },
      data: {
        ...data,
        category: { connect: { name: data.category?.name } },
        projectStatus: { connect: { name: data.projectStatus?.name } },
        owner: { connect: { id: data.owner?.id } },
        skills: {
          set: data.skills,
        },
        labels: {
          set: data.labels,
        },
      },
      include: {
        category: true,
        projectStatus: true,
        skills: true,
        labels: true,
        owner: true,
        projectMembers: { include: { profile: { select: { firstName: true, lastName: true } } } },
        votes: { where: { profileId: session.profileId } },
      },
    })

    return project
  }
)
