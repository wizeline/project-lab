import { paginate, resolver } from "blitz"
import db from "db"
import { Prisma } from "@prisma/client"

interface membershipOutput {
  updatedAt: string
}

export default resolver.pipe(resolver.authorize(), async (userId: String) => {
  function dateDiffInDays(dateOne, dateTwo) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24
    const utc1 = Date.UTC(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate())
    const utc2 = Date.UTC(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate())

    return Math.floor((utc2 - utc1) / _MS_PER_DAY)
  }

  let result
  const today = new Date()

  if (userId) {
    let query =
      await db.$queryRaw<membershipOutput>`SELECT "updatedAt" from "ProjectMembers" where "profileId" = ${userId}`
    let updatedAt = new Date(query[0].updatedAt)
    result = dateDiffInDays(updatedAt, today)
  } else {
    return null
  }
  return result
})
