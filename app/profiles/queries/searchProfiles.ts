import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (search: String) => {
  const select = `
    SELECT id as profileId, firstName || ' ' || lastName || ' <' || email || '>' as name
    FROM profiles_idx
  `
  const orderBy = `
    ORDER BY firstName, lastName
    LIMIT 50;
  `
  let result
  if (search && search !== "") {
    const prefixSearch = '"' + search + '"*'
    const where = "WHERE profiles_idx match ?"
    result = await db.$queryRaw(
      `
      ${select}
      ${where}
      ${orderBy}
    `,
      prefixSearch
    )
  } else {
    result = await db.$queryRaw(`
      ${select}
      ${orderBy}
    `)
  }
  return result
})
