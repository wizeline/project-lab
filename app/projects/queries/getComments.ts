import { resolver, NotFoundError, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetComments = z.object({
  projectId: z.string().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetComments),
  resolver.authorize(),
  async ({ projectId }, Ctx) => {
    const comments = await db.comments.findMany({
      where: { projectId: projectId },
      orderBy: [{ createdAt: "desc" }],
      include: {
        author: { select: { firstName: true, lastName: true, avatarUrl: true, id: true } },
        children: {
          include: {
            author: { select: { firstName: true, lastName: true, avatarUrl: true, id: true } },
          },
        },
      },
    })

    if (!comments) throw new NotFoundError()
    return comments
  }
)
