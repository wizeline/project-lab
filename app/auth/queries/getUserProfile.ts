import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetUserProfile = z.object({
  // This accepts type of undefined, but is required at runtime
  userId: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetUserProfile),
  resolver.authorize(),
  async ({ userId }) => {
    const userProfileResult = await db.$queryRaw`SELECT p.id FROM Profiles p
    INNER JOIN User u ON u.email = p.email
    WHERE u.id = ${userId}`
    const profileId = userProfileResult.length == 1 ? userProfileResult[0].id : null

    return profileId
  }
)
