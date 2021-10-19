import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  return await db.projectStatus.findMany({ orderBy: { name: "asc" } })
})
