import { resolver, Ctx } from "blitz"
import { Prisma } from "@prisma/client"
import db from "db"

interface SearchProjectsInput {
  search: string | string[]
  status: any
  category: any
  skill: any
  discipline: any
  location: any
  label: any
  skip: number
  take: number
  projectStatus: any
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
  owner: string
}

interface CountOutput {
  count: number
}

interface FacetOutput {
  name: string
  count: number
}

interface ProjectFacetsOutput extends FacetOutput {
  Status: string
}

export class SearchProjectsError extends Error {
  name = "SearchProjectsError"
  message = "There was an error while searching for projects."
}

export default resolver.pipe(
  resolver.authorize(),
  async (
    {
      search,
      category,
      status,
      skill,
      discipline,
      label,
      projectStatus,
      location,
      orderBy,
      skip = 0,
      take = 50,
    }: SearchProjectsInput,
    { session }: Ctx
  ) => {
    const prefixSearch = "%" + search + "%"
    let where = Prisma.sql`WHERE p.id IS NOT NULL`
    if (search && search !== "") {
      search !== "myProposals"
        ? (where = Prisma.sql`WHERE ((p.name || p.description || p.valueStatement || p.searchSkills) LIKE ${prefixSearch})`)
        : (where = Prisma.sql`WHERE pm.profileId == ${session.profileId}`)
    }

    if (status) {
      const statuses = typeof status === "string" ? [status] : status
      where = Prisma.sql`${where} AND s.name IN (${Prisma.join(statuses)}) `
    }

    if (category) {
      const categories = typeof category === "string" ? [category] : category
      where = Prisma.sql`${where} AND categoryName IN (${Prisma.join(categories)})`
    }

    if (skill) {
      const skills = typeof skill === "string" ? [skill] : skill
      where = Prisma.sql`${where} AND Skills.name IN (${Prisma.join(skills)})`
    }

    if (discipline) {
      const disciplines = typeof discipline === "string" ? [discipline] : discipline
      where = Prisma.sql`${where} AND Disciplines.name IN (${Prisma.join(disciplines)})`
    }

    if (label) {
      const labels = typeof label === "string" ? [label] : label
      where = Prisma.sql`${where} AND Labels.name IN (${Prisma.join(labels)})`
    }
    if (projectStatus) {
      const selectedStatus = typeof label === "string" ? [projectStatus][0] : projectStatus
      let filterValue: number[] = []

      switch (selectedStatus) {
        case "Active":
          filterValue[0] = 0
          break
        case "Archived":
          filterValue[0] = 1
          break
      }

      if (filterValue.length !== 0)
        where = Prisma.sql` ${where} AND p.isArchived== ${Prisma.join(filterValue)}`
    }

    if (location) {
      const locationSelected = typeof location === "string" ? [location] : location
      where = Prisma.sql`${where} AND loc.name == ${Prisma.join(locationSelected)}`
    }

    // order by string for sorting
    const orderByText = `${
      orderBy.field === "projectMembers" || orderBy.field === "votesCount" ? "" : "p."
    }${orderBy.field} ${orderBy.order}`

    // convert where into string for the projects query
    let whereString = where.sql
    let strIdx = 0
    while (whereString.match(/[?]/)) {
      if (where.values[strIdx] || where.values[strIdx] === 0)
        //When second statement is removed, bool values could cause an infinte loop
        whereString = whereString.replace("?", "'" + where.values[strIdx]?.toString() + "'" || "")
      strIdx++
    }

    const projects = await db.$queryRawUnsafe<SearchProjectsOutput[]>(
      `SELECT p.id, p.name, p.description, p.searchSkills, pr.firstName, pr.lastName, pr.avatarUrl, status, count(distinct v.profileId) votesCount, s.color,
        p.createdAt,
        p.updatedAt,
        p.ownerId,
      COUNT(DISTINCT pm.profileId) as projectMembers
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN Vote v on v.projectId = p.id
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${whereString}
      GROUP BY p.id
      ORDER BY ${orderByText}
      LIMIT ${take} OFFSET ${skip};
    `
    )

    const countResult = await db.$queryRaw<CountOutput[]>`
      SELECT count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
    `

    const statusFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT s.name, COUNT(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN ProjectStatus s on  s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      GROUP BY s.name
      ORDER BY count DESC;`

    const categoryFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT p.categoryName as name, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      AND p.categoryName IS NOT NULL
      GROUP BY categoryName
      ORDER BY count DESC
      LIMIT 10
    `

    const skillFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT Skills.name, Skills.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      AND Skills.name IS NOT NULL
      AND Skills.id IS NOT NULL
      GROUP BY Skills.name
      ORDER BY count DESC
      LIMIT 10
    `

    const disciplineFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT Disciplines.name, Disciplines.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      AND Disciplines.name IS NOT NULL
      AND Disciplines.id IS NOT NULL
      GROUP BY Disciplines.name
      ORDER BY count DESC
      LIMIT 10
    `
    const labelFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT Labels.name, Labels.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      AND Labels.name IS NOT NULL
      AND Labels.id IS NOT NULL
      GROUP BY Labels.name
      ORDER BY count DESC
      LIMIT 10
    `

    const projectFacets = await db.$queryRaw<ProjectFacetsOutput[]>`
     SELECT DISTINCT p.isArchived as 'Status', COUNT (p.id) as count
     FROM Projects p
     WHERE 1=1 AND p.id IN (Select p.id  FROM Projects p
     INNER JOIN projects_idx ON projects_idx.id = p.id
     INNER JOIN ProjectStatus s on s.name = p.status
     INNER JOIN Profiles pr on pr.id = p.ownerId
     INNER JOIN ProjectMembers pm ON pm.projectId = p.id
     INNER JOIN Locations loc ON loc.id = pr.locationId
     LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
     LEFT JOIN Skills ON _ps.B = Skills.id
     LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
     LEFT JOIN Labels ON _lp.A = Labels.id
     LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
       ${where}
     )
     GROUP BY p.isArchived
     ORDER BY p.isArchived ASC`

    const locationsFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT loc.name, loc.id, count(DISTINCT p.id) as count
      FROM Projects p
      INNER JOIN projects_idx ON projects_idx.id = p.id
      INNER JOIN ProjectStatus s on s.name = p.status
      INNER JOIN ProjectMembers pm ON pm.projectId = p.id
      INNER JOIN Profiles pr on pr.id = p.ownerId
      INNER JOIN Locations loc ON loc.id = pr.locationId
      LEFT JOIN _ProjectsToSkills _ps ON _ps.A = p.id
      LEFT JOIN Skills ON _ps.B = Skills.id
      LEFT JOIN _LabelsToProjects _lp ON _lp.B = p.id
      LEFT JOIN Labels ON _lp.A = Labels.id
      LEFT JOIN _DisciplinesToProjects _dp ON _dp.B = p.id
      LEFT JOIN Disciplines ON _dp.A = Disciplines.id
      ${where}
      AND loc.name IS NOT NULL
      AND loc.id IS NOT NULL
      GROUP BY loc.name
      ORDER BY count DESC
    `

    if (countResult.length < 1) throw new SearchProjectsError()

    const hasMore = skip + take < (countResult[0] ? countResult[0].count : 0)
    const nextPage = hasMore ? { take, skip: skip + take } : null

    return {
      projects,
      nextPage,
      hasMore,
      count: countResult[0]?.count,
      statusFacets,
      categoryFacets,
      skillFacets,
      labelFacets,
      projectFacets,
      disciplineFacets,
      locationsFacets,
    }
  }
)
