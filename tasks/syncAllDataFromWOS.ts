import { PrismaClient } from "@prisma/client"
import LocationWOSDTO from "./types/LocationWOSDTO"
import JobTitleWOSDTO from "./types/JobTitleWOSDTO"
import ProfileWOSDTO from "./types/ProfileWOSDTO"
import { DataProvider } from "./services/interface/DataProvider"
import SkillWOSDTO from "./types/SkillWOSDTO"

const db = new PrismaClient()

export default async function syncCatalogs(dataProvider: DataProvider, db: PrismaClient) {
  let skillsFromWizelineOs: SkillWOSDTO[]
  let locationsFromWizelineOs: LocationWOSDTO[]
  let jobTitlesFromWizelineOs: JobTitleWOSDTO[]
  let profilesFromWizelineOS: ProfileWOSDTO[]
  try {
    skillsFromWizelineOs = await dataProvider.getAllFromCatalog("skills")
    locationsFromWizelineOs = await dataProvider.getAllFromCatalog("locations")
    jobTitlesFromWizelineOs = await dataProvider.getAllFromCatalog("jobTitles")
    profilesFromWizelineOS = await dataProvider.getProfilesFromWizelineOS()
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

  const skillsUpserts = skillsFromWizelineOs.map((skill) => {
    return db.skills.upsert({
      where: { id: skill.id },
      update: { name: skill.name },
      create: { id: skill.id, name: skill.name },
    })
  })

  const jobTitlesUpserts = jobTitlesFromWizelineOs.map((jobTitle) => {
    return db.jobTitles.upsert({
      where: { id: jobTitle.id },
      update: { name: jobTitle.name, nameAbbreviation: jobTitle.nameAbbreviation },
      create: { id: jobTitle.id, name: jobTitle.name, nameAbbreviation: jobTitle.nameAbbreviation },
    })
  })

  const locationsUpserts = locationsFromWizelineOs.map((location) => {
    return db.locations.upsert({
      where: { id: location.id },
      update: { name: location.name },
      create: { id: location.id, name: location.name },
    })
  })

  const profilesUpsert = profilesFromWizelineOS.map((profile) => {
    return db.profiles.upsert({
      where: { id: profile.id },
      update: {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatar,
        // jobTitleId: profile.jobTitleId,
        jobLevelTier: profile.jobLevelTier,
        department: profile.department,
        terminatedAt: profile.terminatedAt,
        locationId: profile.locationId,
        profileSkills: {
          create: profile.profileSkills,
        },
      },
      create: {
        id: profile.id,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatar,
        // jobTitleId: profile.jobTitleId,
        jobLevelTier: profile.jobLevelTier,
        department: profile.department,
        terminatedAt: profile.terminatedAt,
        locationId: profile.locationId,
        profileSkills: {
          create: profile.profileSkills,
        },
      },
    })
  })

  await db.$transaction([
    db.skills.deleteMany({
      where: {
        id: {
          notIn: skillsFromWizelineOs.map((skill) => {
            return skill.id
          }),
        },
      },
    }),
    db.jobTitles.deleteMany({
      where: {
        id: {
          notIn: jobTitlesFromWizelineOs.map((skill) => {
            return skill.id
          }),
        },
      },
    }),
    db.locations.deleteMany({
      where: {
        id: {
          notIn: locationsFromWizelineOs.map((skill) => {
            return skill.id
          }),
        },
      },
    }),
    ...skillsUpserts,
    ...jobTitlesUpserts,
    ...locationsUpserts,
  ])

  console.info(`Inserted/Updated ${skillsFromWizelineOs.length} new skill(s)`)
  console.info(`Inserted/Updated ${locationsFromWizelineOs.length} new locations(s)`)
  console.info(`Inserted/Updated ${jobTitlesFromWizelineOs.length} new job titles(s)`)

  await db.$transaction([
    db.profiles.deleteMany({
      where: {
        id: {
          notIn: profilesFromWizelineOS.map((profile) => {
            return profile.id
          }),
        },
      },
    }),
    db.profileSkills.deleteMany({}),
    ...profilesUpsert,
  ])

  console.info(`Inserted/Updated ${profilesFromWizelineOS.length} new profiles(s)`)
}
