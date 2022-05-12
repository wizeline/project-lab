import { PrismaClient } from "@prisma/client"
import LocationWOSDTO from "./types/LocationWOSDTO"
import JobTitleWOSDTO from "./types/JobTitleWOSDTO"
import ProfileWOSDTO from "./types/ProfileWOSDTO"
import SkillWOSDTO from "./types/SkillWOSDTO"

const db = new PrismaClient()

export default async function syncCatalogs(
  getAllFromCatalog: (name: string) => Promise<any>,
  getProfilesFromWizelineOS: () => Promise<ProfileWOSDTO[]>,
  db: PrismaClient
) {
  let skillsFromWizelineOs: SkillWOSDTO[]
  let locationsFromWizelineOs: LocationWOSDTO[]
  let jobTitlesFromWizelineOs: JobTitleWOSDTO[]
  let profilesFromWizelineOS: ProfileWOSDTO[]
  try {
    skillsFromWizelineOs = await getAllFromCatalog("skills")
    locationsFromWizelineOs = await getAllFromCatalog("locations")
    jobTitlesFromWizelineOs = await getAllFromCatalog("jobTitles")
    profilesFromWizelineOS = await getProfilesFromWizelineOS()
  } catch (e) {
    console.error(e)
    return
  }

  if (
    skillsFromWizelineOs.length === 0 &&
    locationsFromWizelineOs.length === 0 &&
    jobTitlesFromWizelineOs.length === 0 &&
    profilesFromWizelineOS.length === 0
  ) {
    console.info("No found information in Wizeline OS with filter criteria")
    return
  }

  const skillsIds = skillsFromWizelineOs.map((skill) => {
    return skill.id
  })

  const locationsIds = locationsFromWizelineOs.map((location) => {
    return location.id
  })

  const jobTitleSkillIds = jobTitlesFromWizelineOs.map((skill) => {
    return skill.id
  })

  const profileIds = profilesFromWizelineOS.map((profile) => {
    return profile.id
  })

  const skillsUpserts = skillsFromWizelineOs.map((skill) => {
    return db.skills.upsert({
      where: { id: skill.id },
      update: { name: skill.name },
      create: { ...skill },
    })
  })

  const jobTitlesUpserts = jobTitlesFromWizelineOs.map((jobTitle) => {
    return db.jobTitles.upsert({
      where: { id: jobTitle.id },
      update: { name: jobTitle.name, nameAbbreviation: jobTitle.nameAbbreviation },
      create: { ...jobTitle },
    })
  })

  const locationsUpserts = locationsFromWizelineOs.map((location) => {
    return db.locations.upsert({
      where: { id: location.id },
      update: { name: location.name },
      create: { ...location },
    })
  })

  const profilesUpsert = profilesFromWizelineOS.map((profile) => {
    const { jobTitleId, jobTitle, ...otherProps } = profile
    return db.profiles.upsert({
      where: { id: profile.id },
      update: {
        ...otherProps,
      },
      create: {
        ...otherProps,
      },
    })
  })

  await db.$transaction([
    db.$queryRaw`DELETE FROM JobTitles WHERE id NOT IN (${jobTitleSkillIds.join(",")})`,
    db.$queryRaw`DELETE FROM Locations WHERE id NOT IN (${locationsIds.join(",")})`,
    db.$queryRaw`DELETE FROM Skills WHERE id NOT IN (${skillsIds.join(",")})`,
    ...skillsUpserts,
    ...jobTitlesUpserts,
    ...locationsUpserts,
  ])

  console.info(`Inserted/Updated ${skillsFromWizelineOs.length} new skill(s)`)
  console.info(`Inserted/Updated ${locationsFromWizelineOs.length} new locations(s)`)
  console.info(`Inserted/Updated ${jobTitlesFromWizelineOs.length} new job titles(s)`)

  await db.$transaction([
    db.$queryRaw`UPDATE Profiles SET deleted=1 WHERE id NOT IN (${profileIds.join(",")})`,
    ...profilesUpsert,
  ])

  console.info(`Inserted/Updated ${profilesFromWizelineOS.length} new profiles(s)`)
}
