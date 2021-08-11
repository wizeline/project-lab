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
  const dataProvider = new WizelineOSDataProvider()
  try {
    skillsFromWizelineOs = await dataProvider.getSkillsFromWizelineOS()
  } catch (e) {
    console.error(e)
    return
  }

  await db.skills.deleteMany({
    where: {
      name: {
        notIn: skillsFromWizelineOs.map((skill) => {
          return skill.id
        }),
      },
    },
  })
  if (!skillsFromWizelineOs || skillsFromWizelineOs.length == 0) {
    console.info("No skills found on Wizeline OS with filter criteria")
    return
  }

  if (skillsFromWizelineOs.length == 0) {
    console.info("No new skills to insert")
    return
  }

  const upserts = skillsFromWizelineOs.map((skill) => {
    return db.skills.upsert({
      where: { id: skill.id },
      update: {},
      create: { id: skill.id, name: skill.name },
    })
  })
  await db.$transaction(upserts)
  console.info(`Inserted/Updated ${skillsFromWizelineOs.length} new skill(s)`)
}

//export default task
task().finally(() => {
  db.$disconnect()
})
