import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { getUserProfile } from "app/auth/mutations/login"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, role: "USER" },
    select: { id: true, name: true, email: true, role: true },
  })
  const profileId = await getUserProfile(user.id)

  await ctx.session.$create({ userId: user.id, role: user.role as Role, profileId: profileId })
  return user
})
