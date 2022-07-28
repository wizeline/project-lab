import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const GetProjectMembers = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetProjectMembers),
  resolver.authorize(),
  async ({ id }) => {
    const projectMentees = await db.mentorships.findMany({
      where: {
        projectId: id,
      },
      include: {
        mentees: true,
      },
    })

    let finalMentees = {}
    projectMentees.forEach((val) => {
      const { mentorId, projectId, menteeId, mentees, ...mentee } = val
      finalMentees[mentorId] = finalMentees[mentorId]
        ? {
            ...finalMentees[mentorId],
            [Object.keys(finalMentees[mentorId]).length]: {
              ...mentee,
              profileId: menteeId,
              name: `${mentees.firstName} ${mentees.lastName} <${mentees.email}>`,
            },
          }
        : {
            0: {
              ...mentee,
              profileId: menteeId,
              name: `${mentees.firstName} ${mentees.lastName} <${mentees.email}>`,
            },
          }
    })
    console.log(finalMentees)
    return finalMentees
  }
)
