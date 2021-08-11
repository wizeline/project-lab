import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import WizelineOSDataProvider from "./Services/WOS/WizelineOSDataProvider"

const myEnv = dotenv.config()
dotenvExpand(myEnv)
const db = new PrismaClient()

async function task() {
  let jobTitlesFromWizelineOs: {
    id: string
    name: string
    nameAbbreviation: string
  }[]
  const dataProvider = new WizelineOSDataProvider()
  try {
    jobTitlesFromWizelineOs = await dataProvider.getJobTitlesFromWizelineOS()
  } catch (e) {
    console.error(e)
    return
  }
  const idsFromWOS = jobTitlesFromWizelineOs.map((jobTitle) => {
    return jobTitle.id
  })
  await db.jobTitles.deleteMany({ where: { id: { notIn: idsFromWOS } } })

  if (!jobTitlesFromWizelineOs || jobTitlesFromWizelineOs.length == 0) {
    console.info("No job titles found on Wizeline OS with filter criteria")
    return
  }

  if (jobTitlesFromWizelineOs.length == 0) {
    console.info("No new job titles to insert")
    return
  }

  const upserts = jobTitlesFromWizelineOs.map((jobTitle) => {
    return db.jobTitles.upsert({
      where: { id: jobTitle.id },
      update: {},
      create: { id: jobTitle.id, name: jobTitle.name, nameAbbreviation: jobTitle.nameAbbreviation },
    })
  })
  await db.$transaction(upserts)
  console.info(`Inserted/Updated ${jobTitlesFromWizelineOs.length} new job titles(s)`)
}

//export default task
task().finally(() => {
  db.$disconnect()
})
