import { resolver } from "blitz"
import { Prisma } from "@prisma/client"
import db from "db"
import { RawValue } from "@prisma/client/runtime"

interface SearchProjectsInput {
  search: string | string[]
  category: any
  skill: any
  label: any
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
  async ({ search, category, skill, label, skip = 0, take = 50 }: SearchProjectsInput) => {
    const prefixSearch = search + "*"
    let where = Prisma.empty

    if (search && search !== "") {
      where = Prisma.sql`${where} WHERE projects_idx match ${prefixSearch}`
    }

    if (category) {
      const categories = typeof category === "string" ? [category] : category
      where =
        where === Prisma.empty
          ? Prisma.sql`WHERE categoryName IN (${Prisma.join(categories)})`
          : Prisma.sql`${where} AND categoryName IN (${Prisma.join(categories)})`
    }

    if (skill) {
      const skills = typeof skill === "string" ? [skill] : skill
      where =
        where === Prisma.empty
          ? Prisma.sql`WHERE Skills.name IN (${Prisma.join(skills)})`
          : Prisma.sql`${where} AND Skills.name IN (${Prisma.join(skills)})`
    }

    if (label) {
      const labels = typeof label === "string" ? [label] : label
      where =
        where === Prisma.empty
          ? Prisma.sql`WHERE Labels.name IN (${Prisma.join(labels)})`
          : Prisma.sql`${where} AND Labels.name IN (${Prisma.join(labels)})`
    }

    const projects = await db.$queryRaw<SearchProjectsOutput[]>`
      SELECT p.id, p.name, p.description, pr.firstName, pr.lastName, pr.avatarUrl, status, votesCount, s.color,
        strftime('%M %d, %y', p.createdAt) as createdAt
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN Profiles pr on pr.id = p.ownerId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.B = Labels.id
      ${where}
      GROUP BY p.id
      ORDER BY rank, p.name
      LIMIT ${take} OFFSET ${skip};
    `
    const countResult = await db.$queryRaw`
      SELECT count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.B = Labels.id
      ${where}
    `

    const categoryFacets = await db.$queryRaw`
      SELECT p.categoryName as name, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.B = Labels.id
      ${where}
      GROUP BY categoryName
      ORDER BY count DESC
      LIMIT 10
    `
    const skillFacets = await db.$queryRaw`
      SELECT Skills.name, Skills.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.B = Labels.id
      ${where}
      GROUP BY Skills.name
      ORDER BY count DESC
      LIMIT 10
    `
    const labelFacets = await db.$queryRaw`
      SELECT Labels.name, Labels.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      ${where}
      GROUP BY Labels.name
      ORDER BY count DESC
      LIMIT 10
    `

    if (countResult.length < 1) throw new SearchProjectsError()

    const hasMore = skip + take < countResult[0].count
    const nextPage = hasMore ? { take, skip: skip + take } : null

    return {
      projects,
      nextPage,
      hasMore,
      count: countResult[0].count,
      categoryFacets,
      skillFacets,
      labelFacets,
    }
  }
)