import { resolver } from "blitz"
import db from "db"
import { Prisma } from "@prisma/client"

export default resolver.pipe(resolver.authorize(), async (search: String) => {
  const select = Prisma.sql`
    SELECT id as "profileId", "firstName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `
  const orderBy = Prisma.sql`
    ORDER BY "firstName", "lastName"
    LIMIT 50;
  `
  let result
  if (search && search !== "") {
    const prefixSearch = `%${search}%`
    const where = Prisma.sql`WHERE "searchCol" like lower(unaccent(${prefixSearch}))`
    result = await db.$queryRaw`
      ${select}
      ${where}
      ${orderBy}
    `
  } else {
    result = await db.$queryRaw`
      ${select}
      ${orderBy}
    `
  }
  return result
})
