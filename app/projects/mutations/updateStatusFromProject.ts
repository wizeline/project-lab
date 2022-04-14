import { resolver, Ctx } from "blitz"
import db from "db"
import { ProfileNotFoundError } from "app/auth/mutations/login"
import { UpdateMultipleProjectsStatus } from "app/projects/validations"

export default resolver.pipe(
  resolver.zod(UpdateMultipleProjectsStatus),
  resolver.authorize(),
  async ({ status, ids }, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()
    await db.projects.updateMany({
      where: { id: { in: ids } },
      data: { status: status },
    })
  }
)
