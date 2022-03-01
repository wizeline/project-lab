import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const Labels = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(Labels), resolver.authorize(), async (input) => {
  // Do your stuff :)
})
