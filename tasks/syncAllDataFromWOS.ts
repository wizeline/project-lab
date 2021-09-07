import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import WizelineOSDataProvider from "./Services/WOS/WizelineOSDataProvider"

const myEnv = dotenv.config()
dotenvExpand(myEnv)
const db = new PrismaClient()

async function task() {
  let skillsFromWizelineOs: {
    id: string
    name: string
  }[]
  let locationsFromWizelineOs: {
    id: string
    name: string
  }[]
  let jobTitlesFromWizelineOs: {
    id: string
    name: string
    nameAbbreviation: string
  }[]
  let profi
  let profilesFromWizelineOS: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar: string
    jobTitleId: string
    jobTitle: string
    jobLevelTier: string
    department: string
    terminatedAt: string
    locationId: string
    profileSkills: any
  }[]
  const dataProvider = new WizelineOSDataProvider()
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
    jobTitlesFromWizelineOs.length === 0
  ) {
    console.info("No found information in Wizeline OS with filter criteria")
    return
  }

  const skillsUpserts = skillsFromWizelineOs.map((skill) => {
    return db.skills.upsert({
      where: { id: skill.id },
      update: {},
      create: { id: skill.id, name: skill.name },
    })
  })

  const jobTitlesUpserts = jobTitlesFromWizelineOs.map((jobTitle) => {
    return db.jobTitles.upsert({
      where: { id: jobTitle.id },
      update: {},
      create: { id: jobTitle.id, name: jobTitle.name, nameAbbreviation: jobTitle.nameAbbreviation },
    })
  })

  const locationsUpserts = locationsFromWizelineOs.map((location) => {
    return db.locations.upsert({
      where: { id: location.id },
      update: {},
      create: { id: location.id, name: location.name },
    })
  })

  const profilesUpsert = profilesFromWizelineOS.map((profile) => {
    return db.profiles.upsert({
      where: { id: profile.id },
      update: {},
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

//export default task
task().finally(() => {
  db.$disconnect()
})
