import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"
import { getUserProfile } from "app/auth/mutations/login"
import { Role } from "types"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  if (email !== "test@wizeline.com" || password !== process.env.TEST_USER_PASSWORD) {
    throw new AuthenticationError()
  }
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
    },
    select: { id: true, name: true, email: true, role: true },
  })

  const profileId = await getUserProfile(user.id)

  await ctx.session.$create({ userId: user.id, role: user.role as Role, profileId: profileId })
  return user
})
