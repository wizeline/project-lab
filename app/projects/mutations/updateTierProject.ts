import { resolver, Ctx } from "blitz"
import db from "db"
import { ProfileNotFoundError } from "app/auth/mutations/login"

export default resolver.pipe(
  resolver.authorize(),
  async ({ id, tierName, ids }, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()

    const updateProject = async (id: string) =>
      await db.projects.update({
        where: {
          id,
        },
        data: {
          innovationTiers: { connect: { name: tierName } },
        },
      })

    if (ids?.length === 1) {
      return updateProject(ids[0])
    } else if (ids?.length) {
      return await Promise.all(ids.map(async (id) => updateProject(id)))
    }

    return updateProject(id)
  }
)
