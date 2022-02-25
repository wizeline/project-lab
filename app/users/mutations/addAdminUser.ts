import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const AddAdminUser = z.object({
  email: z.string(),
})

export default resolver.pipe(
  resolver.zod(AddAdminUser),
  resolver.authorize(),
  async ({ email }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const user = await db.user.upsert({
      where: { email },
      create: {
        email,
        role: "ADMIN",
      },
      update: { email, role: "ADMIN" },
    })

    return user
  }
)
