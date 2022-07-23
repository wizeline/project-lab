import { resolver, Ctx } from "blitz"
import { Prisma } from "@prisma/client"
import db from "db"

interface SearchProjectsInput {
  search: string | string[]
  status: any
  skill: any
  discipline: any
  tier: any
  location: any
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
  owner: string
}

interface SearchIdsOutput {
  id: string
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
      status,
      skill,
      discipline,
      label,
      tier,
      location,
      orderBy,
      skip = 0,
      take = 50,
    }: SearchProjectsInput,
    { session }: Ctx
  ) => {
    let where = Prisma.sql`WHERE p.id IS NOT NULL`
    if (search && search !== "") {
      search === "myProposals"
        ? (where = Prisma.sql`WHERE pm."profileId" = ${session.profileId}`)
        : (where = Prisma.sql`WHERE "tsColumn" @@ websearch_to_tsquery('english', ${search})`)
    }

    const statuses = typeof status === "string" ? [status] : []
    if (status) {
      where = Prisma.sql`${where} AND p.status IN (${Prisma.join(statuses)}) `
    }

    const skills = typeof skill === "string" ? [skill] : []
    if (skill) {
      where = Prisma.sql`${where} AND "Skills".name IN (${Prisma.join(skills)})`
    }

    const disciplines = typeof discipline === "string" ? [discipline] : []
    if (discipline) {
      where = Prisma.sql`${where} AND "Disciplines".name IN (${Prisma.join(disciplines)})`
    }

    const tiers = typeof tier === "string" ? [tier] : []
    if (tier) {
      where = Prisma.sql`${where} AND "tierName" IN (${Prisma.join(tiers)})`
    }

    const labels = typeof label === "string" ? [label] : []
    if (label) {
      where = Prisma.sql`${where} AND "Labels".name IN (${Prisma.join(labels)})`
    }

    const locations = typeof location === "string" ? [location] : []
    if (location) {
      where = Prisma.sql`${where} AND loc.name IN (${Prisma.join(locations)})`
    }

    let orderQuery = Prisma.sql`ORDER BY "tierName" ASC`
    if (orderBy.field == "updatedAt") {
      orderQuery = Prisma.sql`ORDER BY p."updatedAt" DESC`
    } else if (orderBy.field == "votesCount") {
      orderQuery = Prisma.sql`ORDER BY "votesCount" DESC`
    } else if (orderBy.field == "projectMembers") {
      orderQuery = Prisma.sql`ORDER BY "projectMembers" DESC`
    } else if (orderBy.field == "mostRecent") {
      orderQuery = Prisma.sql`ORDER BY p."createdAt" DESC`
    }

    const ids = await db.$queryRaw<SearchIdsOutput[]>`
      SELECT DISTINCT p.id
      FROM "Projects" p
      INNER JOIN "ProjectStatus" s on s.name = p.status
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "Vote" v on v."projectId" = p.id
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where};
    `

    const projectIdsWhere = Prisma.sql`WHERE p.id IN (${Prisma.join(ids.map((val) => val.id))})`

    const projects = await db.$queryRaw<SearchProjectsOutput[]>`
      SELECT p.id, p.name, p.description, p."searchSkills", pr."firstName", pr."lastName", pr."avatarUrl", p.status, count(distinct v."profileId") AS "votesCount", s.color,
        p."createdAt",
        p."updatedAt",
        p."ownerId",
        p."tierName",
      COUNT(DISTINCT pm."profileId") as "projectMembers"
      FROM "Projects" p
      INNER JOIN "ProjectStatus" s on s.name = p.status
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      LEFT JOIN "Vote" v on v."projectId" = p.id
      ${projectIdsWhere}
      GROUP BY p.id, pr.id, s.name
      ${orderQuery}
      LIMIT ${take} OFFSET ${skip};
    `

    const statusFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT p.status as name, COUNT(DISTINCT p.id) as count
      FROM "Projects" p
      ${projectIdsWhere} AND p.status NOT IN (${statuses.length > 0 ? Prisma.join(statuses) : ""})
      GROUP BY p.status
      ORDER BY count DESC;`

    const skillFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT "Skills".name, "Skills".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      ${projectIdsWhere} AND "Skills".name NOT IN (${skills.length > 0 ? Prisma.join(skills) : ""})
      AND "Skills".name IS NOT NULL
      AND "Skills".id IS NOT NULL
      GROUP BY "Skills".id
      ORDER BY count DESC
    `

    const disciplineFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT "Disciplines".name, "Disciplines".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${projectIdsWhere} AND "Disciplines".name NOT IN (${
      disciplines.length > 0 ? Prisma.join(disciplines) : ""
    })
      AND "Disciplines".name IS NOT NULL
      AND "Disciplines".id IS NOT NULL
      GROUP BY "Disciplines".id
      ORDER BY count DESC
    `

    const labelFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT "Labels".name, "Labels".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      ${projectIdsWhere} AND "Labels".name NOT IN (${labels.length > 0 ? Prisma.join(labels) : ""})
      AND "Labels".name IS NOT NULL
      AND "Labels".id IS NOT NULL
      GROUP BY "Labels".id
      ORDER BY count DESC
    `
    console.log("labels", labelFacets)

    const tierFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT p."tierName" as name, COUNT(DISTINCT p.id) as count
      FROM "Projects" p
      ${projectIdsWhere} AND p."tierName" NOT IN (${tiers.length > 0 ? Prisma.join(tiers) : ""})
      GROUP BY p."tierName"
      ORDER BY count DESC, p."tierName";`

    const locationsFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT loc.name, loc.id, count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      ${projectIdsWhere} AND loc.name NOT IN (${locations.length > 0 ? Prisma.join(locations) : ""})
      AND loc.name IS NOT NULL
      AND loc.id IS NOT NULL
      GROUP BY loc.id
      ORDER BY count DESC
    `

    if (ids.length < 1) throw new SearchProjectsError()

    const hasMore = skip + take < ids.length
    const nextPage = hasMore ? { take, skip: skip + take } : null

    return {
      projects,
      nextPage,
      hasMore,
      count: ids.length,
      statusFacets,
      skillFacets,
      labelFacets,
      disciplineFacets,
      tierFacets,
      locationsFacets,
    }
  }
)
