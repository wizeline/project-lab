import { PrismaClient } from "@prisma/client"

import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import WizelineOSDataProvider from "./services/WOS/WizelineOSDataProvider"
import syncCatalogs from "./syncAllDataFromWOS"

const db = new PrismaClient()

async function task() {
  const myEnv = dotenv.config()
  dotenvExpand(myEnv)
  const dataProvider = new WizelineOSDataProvider()
  await syncCatalogs(dataProvider, db)
}

//close connection
task().finally(() => {
  db.$disconnect()
})
