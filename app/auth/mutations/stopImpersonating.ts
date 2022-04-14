import { resolver } from "blitz"
import db from "db"
import { Role } from "types"
import { getUserProfile } from "./login"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const userId = ctx.session.$publicData.impersonatingFromUserId
  if (!userId) {
    console.log("Already not impersonating anyone")
    return
  }

  const user = await db.user.findFirst({
    where: { id: userId },
  })
  if (!user) throw new Error("Could not find user id " + userId)

  const profileId = await getUserProfile(user.id)

  await ctx.session.$create({
    userId: user.id,
    role: user.role as Role,
    profileId: profileId,
    impersonatingFromUserId: undefined,
  })

  return user
})
