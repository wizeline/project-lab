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

    if (status) {
      const statuses = typeof status === "string" ? [status] : status
      where = Prisma.sql`${where} AND p.status IN (${Prisma.join(statuses)}) `
    }

    if (skill) {
      const skills = typeof skill === "string" ? [skill] : skill
      where = Prisma.sql`${where} AND "Skills".name IN (${Prisma.join(skills)})`
    }

    if (discipline) {
      const disciplines = typeof discipline === "string" ? [discipline] : discipline
      where = Prisma.sql`${where} AND "Disciplines".name IN (${Prisma.join(disciplines)})`
    }

    if (tier) {
      const tiers = typeof tier === "string" ? [tier] : tier
      where = Prisma.sql`${where} AND "tierName" IN (${Prisma.join(tiers)})`
    }

    if (label) {
      const labels = typeof label === "string" ? [label] : label
      where = Prisma.sql`${where} AND "Labels".name IN (${Prisma.join(labels)})`
    }

    if (location) {
      const locationSelected = typeof location === "string" ? [location] : location
      where = Prisma.sql`${where} AND loc.name = ${Prisma.join(locationSelected)}`
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
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "Vote" v on v."projectId" = p.id
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      GROUP BY p.id, pr.id, s.name
      ${orderQuery}
      LIMIT ${take} OFFSET ${skip};
    `

    const countResult = await db.$queryRaw<CountOutput[]>`
      SELECT count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
    `

    const statusFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT p.status as name, COUNT(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      GROUP BY p.status
      ORDER BY count DESC;`

    const skillFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT "Skills".name, "Skills".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      AND "Skills".name IS NOT NULL
      AND "Skills".id IS NOT NULL
      GROUP BY "Skills".id
      ORDER BY count DESC
    `

    const disciplineFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT "Disciplines".name, "Disciplines".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      AND "Disciplines".name IS NOT NULL
      AND "Disciplines".id IS NOT NULL
      GROUP BY "Disciplines".id
      ORDER BY count DESC
    `

    const labelFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT "Labels".name, "Labels".id, count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      AND "Labels".name IS NOT NULL
      AND "Labels".id IS NOT NULL
      GROUP BY "Labels".id
      ORDER BY count DESC
    `

    const tierFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT it.name, COUNT(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      GROUP BY it.name
      ORDER BY count DESC, it.name;`

    const locationsFacets = await db.$queryRaw<FacetOutput[]>`
      SELECT loc.name, loc.id, count(DISTINCT p.id) as count
      FROM "Projects" p
      INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
      INNER JOIN "Profiles" pr on pr.id = p."ownerId"
      INNER JOIN "InnovationTiers" it ON it.name = p."tierName"
      LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
      LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
      LEFT JOIN "Skills" ON _ps."B" = "Skills".id
      LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
      LEFT JOIN "Labels" ON _lp."A" = "Labels".id
      LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
      LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
      ${where}
      AND loc.name IS NOT NULL
      AND loc.id IS NOT NULL
      GROUP BY loc.id
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
      skillFacets,
      labelFacets,
      disciplineFacets,
      tierFacets,
      locationsFacets,
    }
  }
)
