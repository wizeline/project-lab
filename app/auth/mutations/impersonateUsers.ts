import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import { Role } from "types"
import { getUserProfile } from "./login"

export const ImpersonateUserInput = z.object({
  userEmail: z.string(),
})

export default resolver.pipe(
  resolver.zod(ImpersonateUserInput),
  resolver.authorize(),
  async ({ userEmail }, ctx) => {
    const user = await db.user.findFirst({ where: { email: userEmail } })
    if (!user) throw new Error("Could not find user email " + userEmail)

    const profileId = await getUserProfile(user.id)

    await ctx.session.$create({
      userId: user.id,
      role: user.role as Role,
      profileId: profileId,
      impersonatingFromUserId: ctx.session.userId,
    })

    return user
  }
)
