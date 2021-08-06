import { resolver, SecurePassword, AuthenticationError } from "blitz"
import db from "db"
import { Login } from "../validations"
import { Role } from "types"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const email = rawEmail.toLowerCase().trim()
  const password = rawPassword.trim()
  const user = await db.user.findFirst({ where: { email } })
  if (!user) throw new AuthenticationError()

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export const getUserProfile = async (userId: number) => {
  const userProfileResult = await db.$queryRaw`SELECT p.id FROM Profiles p
  INNER JOIN User u ON u.email = p.email
  WHERE u.id = ${userId}`
  const profileId: string | null = userProfileResult.length == 1 ? userProfileResult[0].id : null

  return profileId
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)
  const profileId = await getUserProfile(user.id)

  await ctx.session.$create({ userId: user.id, role: user.role as Role, profileId: profileId })

  return user
})
