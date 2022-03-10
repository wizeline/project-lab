import { resolver, Ctx } from "blitz"

import db from "db"
import { ProfileNotFoundError } from "app/auth/mutations/login"

export default resolver.pipe(
  resolver.authorize(),
  async ({ data, newOwner, projectId }, { session }: Ctx) => {
    if (!session.profileId) throw new ProfileNotFoundError()
    // If by any means, you want to assign an inactive member as Owner, error...
    if (!newOwner.active) throw new Error("You can not assign an inactive member as Owner")

    const projectOwner = await db.projects.update({
      where: { id: projectId },
      data: {
        ownerId: newOwner.profileId,
      },
    })

    return projectOwner
  }
)
