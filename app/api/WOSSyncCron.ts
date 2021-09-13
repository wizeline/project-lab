import { CronJob } from "quirrel/blitz"
import dotenv from "dotenv-flow"
import dotenvExpand from "dotenv-expand"
import syncCatalogs from "tasks/syncAllDataFromWOS"
import {
  getAllFromCatalog,
  getProfilesFromWizelineOS,
} from "tasks/services/WOS/WizelineOSDataProvider"
import { PrismaClient } from "@prisma/client"

export default CronJob(
  "api/WOSSyncCron", // the path of this API route
  "0 * * * *", // cron schedule (see https://crontab.guru)
  async () => {
    const db = new PrismaClient()
    const myEnv = dotenv.config()
    dotenvExpand(myEnv)
    await syncCatalogs(getAllFromCatalog, getProfilesFromWizelineOS, db)
    db.$disconnect()
  }
)
