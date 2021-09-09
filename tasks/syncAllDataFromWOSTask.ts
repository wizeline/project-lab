import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import { getAllFromCatalog, getProfilesFromWizelineOS } from "./services/WOS/WizelineOSDataProvider"
import syncCatalogs from "./syncAllDataFromWOS"

const db = new PrismaClient()

async function task() {
  const myEnv = dotenv.config()
  dotenvExpand(myEnv)
  await syncCatalogs(getAllFromCatalog, getProfilesFromWizelineOS, db)
}

//close connection
task().finally(() => {
  db.$disconnect()
})
