import { resolver, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateMentees = z.object({
  mentees: z.any(),
  projectId: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateMentees),
  resolver.authorize(),
  async ({ mentees, projectId }, { session }: Ctx) => {
    // validate the user is a team member
    const projectMembers = await db.projectMembers.findMany({
      where: { projectId: projectId },
    })

    const isProjectMember =
      projectMembers && projectMembers.filter((p) => p.profileId === session.profileId)

    if (!isProjectMember) {
      throw new Error("You don't have permission to perform this operation")
    }

    //delete all the current mentees to create the new ones
    await db.mentorships.deleteMany({
      where: { projectId },
    })

    // create all new mentees that come fron the front
    let newMentee: any = {}
    for (const mentor in mentees) {
      // Create new mentors if they don't exist or update the mentees number
      await db.projectMembers.upsert({
        where: {
          project_members_project_id_profile_id_key: {
            projectId,
            profileId: mentor,
          },
        },
        update: {
          mentees: mentees[mentor].mentees,
          role: { connect: { name: "Mentor" } },
        },
        create: {
          project: { connect: { id: projectId } },
          profile: { connect: { id: mentor } },
          hoursPerWeek: 0,
          mentees: 1,
          role: { connect: { name: "Mentor" } },
        },
      })
      for (const idx in mentees[mentor]) {
        if (idx === "mentees") continue
        newMentee = {
          mentors: { connect: { id: mentor } },
          mentees: { connect: { id: mentees[mentor][idx].profileId } },
          project: { connect: { id: projectId } },
          startDate: new Date(mentees[mentor][idx].startDate),
          endDate: new Date(mentees[mentor][idx].endDate),
        }

        await db.mentorships.create({
          data: newMentee,
        })

        // add new mentees to Project members if don't exist yet
        if (!projectMembers.find((member) => member.profileId === mentees[mentor][idx].profileId)) {
          await db.projectMembers.create({
            data: {
              project: { connect: { id: projectId } },
              profile: { connect: { id: mentees[mentor][idx].profileId } },
              hoursPerWeek: 0,
              mentees: 1,
              role: { connect: { name: "Intern" } },
            },
          })
        }
      }
    }
  }
)
