import syncCatalogs from "tasks/syncAllDataFromWOS"
import JobTitleWOSDTO from "tasks/types/JobTitleWOSDTO"
import LocationWOSDTO from "tasks/types/LocationWOSDTO"
import ProfileWOSDTO from "tasks/types/ProfileWOSDTO"
import SkillWOSDTO from "tasks/types/SkillWOSDTO"
import db from "db"

const mockDataProviderGetAllFromCatalog = jest.fn((name: string): Promise<any> => {
  if (name === "skills") {
    let data: SkillWOSDTO[] = [
      {
        id: "skillId",
        name: "skillName",
      },
    ]
    return Promise.resolve(data)
  }
  if (name === "locations") {
    let data: LocationWOSDTO[] = [
      {
        id: "locationId",
        name: "locationName",
      },
    ]
    return Promise.resolve(data)
  }
  if (name === "jobTitles") {
    let data: JobTitleWOSDTO[] = [
      {
        id: "jobTitleId",
        name: "JobTitleName",
        nameAbbreviation: "JobTitleName",
      },
    ]
    return Promise.resolve(data)
  }
  return Promise.reject("Invalid catalog name")
})

const mockDataProviderGetProfilesFromWizelineOS = jest.fn((): Promise<ProfileWOSDTO[]> => {
  return Promise.resolve([
    {
      id: "profileId",
      email: "profile@Name",
      firstName: "string",
      lastName: "string",
      avatarUrl: "string",
      jobTitleId: "jobTitleId",
      jobTitle: "string",
      jobLevelTier: "string",
      department: "string",
      locationId: "locationId",
      deleted: false,
    },
  ])
})

const mockDataProviderUpdatedGetAllFromCatalog = jest.fn((name: string): Promise<any> => {
  if (name === "skills") {
    let data: SkillWOSDTO[] = [
      {
        id: "skillId",
        name: "skillNameUpdated",
      },
      {
        id: "skillId2",
        name: "newSkill",
      },
    ]
    return Promise.resolve(data)
  }

  if (name === "locations") {
    let data: LocationWOSDTO[] = [
      {
        id: "locationId",
        name: "locationNameUpdated",
      },
    ]
    return Promise.resolve(data)
  }
  if (name === "jobTitles") {
    let data: JobTitleWOSDTO[] = [
      {
        id: "jobTitleId",
        name: "JobTitleNameUpdated",
        nameAbbreviation: "JobTitleNameUpdated",
      },
    ]
    return Promise.resolve(data)
  }
  return Promise.reject("Invalid catalog name")
})

const mockDataProviderUpdatedGetProfilesFromWizelineOS = jest.fn((): Promise<ProfileWOSDTO[]> => {
  return Promise.resolve([
    {
      id: "profileId",
      email: "profile@Name",
      firstName: "string",
      lastName: "string",
      avatarUrl: "string",
      jobTitleId: "jobTitleId",
      jobTitle: "string",
      jobLevelTier: "string",
      department: "string",
      locationId: "locationId",
      deleted: false,
    },
  ])
})

const cleanData = async () => {
  await db.profiles.deleteMany({})
  await db.$transaction([
    db.skills.deleteMany({}),
    db.jobTitles.deleteMany({}),
    db.locations.deleteMany({}),
  ])
}

beforeEach(async () => {
  await db.$connect()
  await cleanData()
})

afterEach(async () => {
  await cleanData()
  await db.$disconnect()
})

describe("sync All data from WOS", () => {
  test("Create catalogs when empty", async () => {
    await syncCatalogs(
      mockDataProviderGetAllFromCatalog,
      mockDataProviderGetProfilesFromWizelineOS,
      db
    )
    const skills = await db.skills.findMany()
    const jobTitles = await db.jobTitles.findMany()
    const locations = await db.locations.findMany()
    const profiles = await db.profiles.findMany()
    expect(skills.length).toEqual(1)
    expect(jobTitles.length).toEqual(1)
    expect(locations.length).toEqual(1)
    expect(profiles.length).toEqual(1)
  })

  test("update catalogs", async () => {
    await syncCatalogs(
      mockDataProviderGetAllFromCatalog,
      mockDataProviderGetProfilesFromWizelineOS,
      db
    )
    const skills = await db.skills.findMany()
    const jobTitles = await db.jobTitles.findMany()
    const locations = await db.locations.findMany()
    const profiles = await db.profiles.findMany()
    expect(skills.length).toEqual(1)
    expect(jobTitles.length).toEqual(1)
    expect(locations.length).toEqual(1)
    expect(profiles.length).toEqual(1)

    await syncCatalogs(
      mockDataProviderUpdatedGetAllFromCatalog,
      mockDataProviderUpdatedGetProfilesFromWizelineOS,
      db
    )

    const skillsUpdated = await db.skills.findMany()
    const jobTitlesUpdated = await db.jobTitles.findMany()
    const locationsUpdated = await db.locations.findMany()
    const profilesUpdated = await db.profiles.findMany()
    expect(skillsUpdated.length).toEqual(2)
    expect(jobTitlesUpdated[0]?.name).toEqual("JobTitleNameUpdated")
    expect(locationsUpdated[0]?.name).toEqual("locationNameUpdated")
    expect(profilesUpdated.length).toEqual(1)
  })
})

export {}
