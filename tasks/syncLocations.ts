import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import WizelineOSDataProvider from "./Services/WOS/WizelineOSDataProvider"

const myEnv = dotenv.config()
dotenvExpand(myEnv)
const db = new PrismaClient()

async function task() {
  let locationsFromWizelineOs: {
    id: string
    name: string
  }[]
  const dataProvider = new WizelineOSDataProvider()
  try {
    locationsFromWizelineOs = await dataProvider.getLocationsFromWizelineOS()
  } catch (e) {
    console.error(e)
    return
  }
  const idsFromWOS = locationsFromWizelineOs.map((location) => {
    return location.id
  })
  await db.locations.deleteMany({ where: { id: { notIn: idsFromWOS } } })

  if (!locationsFromWizelineOs || locationsFromWizelineOs.length == 0) {
    console.info("No locations found on Wizeline OS with filter criteria")
    return
  }

  if (locationsFromWizelineOs.length == 0) {
    console.info("No new job titles to insert")
    return
  }

  const upserts = locationsFromWizelineOs.map((location) => {
    return db.locations.upsert({
      where: { id: location.id },
      update: {},
      create: { id: location.id, name: location.name },
    })
  })
  await db.$transaction(upserts)
  console.info(`Inserted/Updated ${locationsFromWizelineOs.length} new locations(s)`)
}

//export default task
task().finally(() => {
  db.$disconnect()
})
