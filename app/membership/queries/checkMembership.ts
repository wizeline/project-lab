import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

export default resolver.pipe(resolver.authorize(), async (userId: String) => {
  let result = null
  const date = new Intl.DateTimeFormat([], {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date())
  console.log("sadsad2324")

  if (userId) {
    let lastContribution = new Date(
      ` SELECT updateAt from ProjectMembers where projectId=${userId}`
    )
    console.log(date, lastContribution)
  } else {
    return null
  }
  return result
})
