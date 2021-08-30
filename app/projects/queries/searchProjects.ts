import { resolver } from "blitz"
import { Prisma } from "@prisma/client"
import db from "db"

interface SearchProjectsInput {
  search: string | string[]
  skip: number
  take: number
}

interface SearchProjectsOutput {
  id: string
  name: string
  createdAt: string
  description: string
  status: string
  color: string
  votesCount: string
}

export class SearchProjectsError extends Error {
  name = "SearchProjectsError"
  message = "There was an error while searching for projects."
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ search, skip = 0, take = 50 }: SearchProjectsInput) => {
    const prefixSearch = search + "*"
    const where =
      search && search !== "" ? Prisma.sql`WHERE projects_idx match ${prefixSearch}` : Prisma.empty
    const projects = await db.$queryRaw<SearchProjectsOutput[]>`
      SELECT p.id, p.name, p.description, status, votesCount, s.color,
        strftime('%M %d, %y', createdAt) as createdAt
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      ${where}
      ORDER BY rank, p.name
      LIMIT ${take} OFFSET ${skip};
    `
    const countResult = await db.$queryRaw`
      SELECT count(*) as count
      FROM projects_idx
      ${where}
    `

    if (countResult.length < 1) throw new SearchProjectsError()

    const hasMore = skip + take < countResult[0].count
    const nextPage = hasMore ? { take, skip: skip + take } : null

    return {
      projects,
      nextPage,
      hasMore,
      count: countResult[0].count,
    }
  }
)
