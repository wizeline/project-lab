import { resolver, Ctx } from "blitz"
import { Prisma } from "@prisma/client"
import db from "db"

interface SearchProjectsInput {
  search: string | string[]
  category: any
  skill: any
  label: any
  skip: number
  take: number
  orderBy: { field: string; order: string }
}

interface SearchProjectsOutput {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  description: string
  status: string
  color: string
  votesCount: string
  projectMembers: string
}

export class SearchProjectsError extends Error {
  name = "SearchProjectsError"
  message = "There was an error while searching for projects."
}

export default resolver.pipe(
  resolver.authorize(),
  async (
    { search, category, skill, label, orderBy, skip = 0, take = 50 }: SearchProjectsInput,
    { session }: Ctx
  ) => {
    const prefixSearch = search + "*"
    let where = Prisma.empty

    if (search && search !== "") {
      search !== "myProposals"
        ? (where = Prisma.sql`${where} WHERE projects_idx match ${prefixSearch}`)
        : (where = Prisma.sql`${where} WHERE ownerId == ${session.profileId}`)
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

    // order by string for sorting
    const orderByText = `${orderBy.field === "projectMembers" ? "" : "p."}${orderBy.field} ${
      orderBy.order
    }`

    // convert where into string for the projects query
    let whereString = where.sql
    let strIdx = 0
    while (whereString.match(/[?]/)) {
      if (where.values[strIdx])
        whereString = whereString.replace("?", "'" + where.values[strIdx]?.toString() + "'" || "")
      strIdx++
    }

    const projects = await db.$queryRaw<SearchProjectsOutput[]>(
      `
<<<<<<< HEAD
      SELECT p.id, p.name, p.description, p.searchSkills, pr.firstName, pr.lastName, pr.avatarUrl, status, votesCount, s.color,
=======
      SELECT p.id, p.name, p.description, pr.firstName, pr.lastName, pr.avatarUrl, status, votesCount, s.color,
<<<<<<< HEAD
>>>>>>> 36051a3 (Add sorting by updated at and project members)
        strftime('%M %d, %y', p.createdAt) as createdAt,
        strftime('%M %d, %y', p.updatedAt) as updatedAt,
=======
        p.createdAt,
        p.updatedAt,
>>>>>>> e18612b (Fix date issues in search cards and solve grid issues in filters)
      COUNT(DISTINCT pm.profileId) as projectMembers
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.B = Labels.id
      ${whereString}
      GROUP BY p.id
      ORDER BY ${orderByText}
      LIMIT ${take} OFFSET ${skip};
    `
    )

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
      AND p.categoryName IS NOT NULL
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
      AND Skills.name IS NOT NULL
      AND Skills.id IS NOT NULL
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
      AND Labels.name IS NOT NULL
      AND Labels.id IS NOT NULL
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
