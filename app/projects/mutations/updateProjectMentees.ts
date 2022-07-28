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
    const isProjectMember = await db.projectMembers.findFirst({
      where: { projectId: projectId, profileId: session.profileId },
    })

    if (!isProjectMember) {
      throw new Error("You don't have permission to perform this operation")
    }

    //delete all the current mentees to create the new ones
    await db.mentorships.deleteMany({
      where: { projectId },
    })

    // create all new mentees that come fron the front
    let newMentee: any = {}
    for (const key in mentees) {
      for (const idx in mentees[key]) {
        newMentee = {
          mentors: { connect: { id: key } },
          mentees: { connect: { id: mentees[key][idx].profileId } },
          project: { connect: { id: projectId } },
          startDate: new Date(mentees[key][idx].startDate),
          endDate: new Date(mentees[key][idx].endDate),
        }

        await db.mentorships.create({
          data: newMentee,
        })
      }
    }
  }
)
